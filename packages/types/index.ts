import type { ServerWebSocket } from "bun";

export enum ValidatorStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export type WebSocketMessage = {
    type: "signup" | "validate" | "response";
    data: any;
  }
  
  export type Validator = {
    id: string;
    publicKey: string;
    ipLocation: string;
  }
  
  export type AvailableValidator = {
    id: string;
    socket: any; // Replace with proper WebSocket type
    publicKey: string;
  } 

  export type SignUpIncomingMessage = {
    validatorId: string;
    callbackId: string;
    ipLocation: string;
    publicKey: string;
    signature: string;
  }

  export type ValidateIncomingMessage = {
    callbackId: string;
    validatorId: string;
    websiteId: string;
    url: string;
    latency: number;
    status: ValidatorStatus;
    signature: string;
  }
  export type SignUpOutgoingMessage = {
    callbackId: string;

  }
