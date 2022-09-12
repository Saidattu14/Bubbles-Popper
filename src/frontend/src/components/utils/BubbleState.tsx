import { BubblesInfo } from "../../interfaces/bubbleInterfaces";
import { MessageSendInterface, MessageSendType } from "../../interfaces/messageInterfaces";

const sendMessage = (websocket :WebSocket,msg:any) => 
  {
      try {
        websocket.send(JSON.stringify(msg));
      } catch (error) {
        console.log(error);
      }
  }

 export const requestToServerForBubbleBrustedSuccess = (bubbleId:string, websocket: WebSocket) => {

    let msg:MessageSendInterface = {
        id : bubbleId,
        request : MessageSendType.BrustSuccessful,
        messageRequestString : MessageSendType.BrustSuccessful.toString(),
        data :  null,
      };
      sendMessage(websocket,msg); 
  }

  export const requestToServerForBubbleBrustedFailed = (bubbleId:string, websocket: WebSocket) => {
   
    let msg:MessageSendInterface = {
        id : bubbleId,
        request : MessageSendType.BrustUnsuccessful,
        messageRequestString : MessageSendType.BrustUnsuccessful.toString(),
        data : null,
      };
      sendMessage(websocket,msg);
    
  }


  export const requestToServerForBubblePoppedValidation = (bubble: BubblesInfo, websocket: WebSocket) => {
    
    let msg:MessageSendInterface = {
      id : bubble.id,
      request : MessageSendType.BubblePoppedValidate,
      messageRequestString : MessageSendType.BubblePoppedValidate.toString(),
      data :  null,
    };
    sendMessage(websocket,msg);
  }

  export const requestToServerForBubblesGeneration = (websocket: WebSocket) => {
    
    let msg:MessageSendInterface = {
        id : null,
        request : MessageSendType.GenerateBubbles,
        messageRequestString : MessageSendType.GenerateBubbles.toString(),
        data :  null,
      };
      sendMessage(websocket,msg);
  }
