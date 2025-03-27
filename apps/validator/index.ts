import nacl from "tweetnacl-util"
import nacl2 from "tweetnacl"

const sign = (message:any, secretKey:any) => {
    if (!(secretKey instanceof Uint8Array)) {
        secretKey = nacl.decodeBase64(secretKey.toString());
    }
    if (!(message instanceof Uint8Array)) {
        message = nacl.decodeUTF8(message.toString());
    }
    const signature = nacl2.sign.detached(message, secretKey);

    return nacl.encodeBase64(signature);
}