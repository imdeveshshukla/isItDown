import type { ServerWebSocket } from "bun";
import db from "db";
import type { WebSocketMessage, AvailableValidator, SignUpIncomingMessage, ValidateIncomingMessage } from "types";
import { uuidv7 } from "uuidv7";
import nacl from "tweetnacl-util"
import nacl2 from "tweetnacl"

const CALLBACKS:{[key:string]:(message:any)=>void} = {}
const availableValidators:AvailableValidator[] = []
const COST_PER_VALID = 100

const server = Bun.serve<{ authToken: string }, { message: any }>({
    fetch(req, server) {
      const success = server.upgrade(req);
      if (success) {
        console.log("Upgrade successful");
        return undefined;
      }
  
      // handle HTTP request normally
      return new Response("Simple HTTP Response!!");
    },
    websocket: {
      // this is called when a message is received
      async message(ws:ServerWebSocket<unknown>, message:string) {
        const data = JSON.parse(message) as WebSocketMessage;
        if(data.type === "signup"){
            //verify public key
            const verified = await verifySignature(data.data.signature,data.data.publicKey)
            if(verified){
                await signup(ws, data.data);
            }
            else{
                ws.send(JSON.stringify({
                    type: "signup",
                    data: {
                        error: "Invalid signature"
                    }
                } as WebSocketMessage))
            }
        }
        else if(data.type === "validate"){
            const callback = CALLBACKS[data.data.callbackId];
            if(callback){
                callback(data.data);
                delete CALLBACKS[data.data.callbackId];
            }
        }
        console.log(`Received ${message}`);
      },
      async close(ws:ServerWebSocket<unknown>){
        availableValidators.splice(availableValidators.findIndex(v=>v.socket === ws),1)
      }
    },
  });

const signup = async (ws:ServerWebSocket<unknown>,message:SignUpIncomingMessage)=>{
    const {publicKey,validatorId,callbackId} = message
    const validatorDb = await db.validators.findFirst({
        where:{
            id:validatorId
        }
    });
    if(validatorDb){
        ws.send(JSON.stringify({
            type: "signup",
            data: {
                validatorId: validatorDb.id,
                callbackId
            }
        } as WebSocketMessage))
        availableValidators.push({
            id: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        })
    }
    else{
        //Given the IP return there locations
        const validatorDb = await db.validators.create({
            data:{
                id:uuidv7(),
                publicKey,
                ipLocation:ws.remoteAddress
            }
        })
        ws.send(JSON.stringify({
            type: "signup",
            data: {
                validatorId: validatorDb.id,
                callbackId
            }
        } as WebSocketMessage))
        availableValidators.push({
            id: validatorDb.id,
            socket: ws,
            publicKey: validatorDb.publicKey,
        })
    }
}


setInterval(async ()=>{
    console.log(`Available Validators: ${availableValidators.length}`);

    const webSites = await db.websites.findMany();
    for(const webSite of webSites){
        for(const validator of availableValidators){
            console.log(`Sending website ${webSite.id} to validator ${validator.id}`);
            const newCallbackId = uuidv7();
            validator.socket.send(JSON.stringify({
                type: "validate",
                data: {
                    callbackId:newCallbackId,
                    websiteId:webSite.id,
                    url:webSite.url
                }
            } as WebSocketMessage))
            CALLBACKS[newCallbackId] = async (data:ValidateIncomingMessage)=>{
                const {validatorId,websiteId,latency,status,signature} = data;
                
                //verify the signature with public key of validator
                const verified = await verifySignature(signature,availableValidators.find(v=>v.id === validatorId)?.publicKey)
                if(!verified){
                    return
                }

                await db.$transaction(async (tx)=>{
                    await tx.ticks.create({
                        data:{
                            validatorId,
                            websiteId,
                            latency,
                            status
                        }
                    })

                    await tx.validators.update({
                        where:{
                            id:validatorId
                        },
                        data:{
                            pendingPayments: {
                                increment:COST_PER_VALID,
                            },
                            lastPayment:new Date()
                        }
                    })
                })
            }


            
        }
    }
},1000*60)




const verifySignature = async (signature:any,publicKey:any)=>{
    const message = `I am a validator ${publicKey}`
    const verify = (message:any, signature:any, publicKey:any) => {
        if (!(publicKey instanceof Uint8Array)) {
            publicKey = nacl.decodeBase64(publicKey.toString());
        }
        if (!(message instanceof Uint8Array)) {
            message = nacl.decodeUTF8(message.toString());
        }
        if (!(signature instanceof Uint8Array)) {
            signature = nacl.decodeBase64(signature.toString());
        }
    
        return nacl2.sign.detached.verify(message, signature, publicKey)
    }
    return verify(message,signature,publicKey)
}

console.log(`Listening on ${server.hostname}:${server.port}`);