import { MessageSendInterface, MessageSendType } from "../../interfaces/messageInterfaces";


  const sendMessage = (websocket :WebSocket,msg:any) => 
  {
      try {
        websocket.send(JSON.stringify(msg));
      } catch (error) {
        console.log(error);
      }
  }


 export const sendMessageToServerOnPauseState = (websocket: WebSocket) => {
    let msg:MessageSendInterface = {
      id : null,
      request : MessageSendType.PauseGame,
      messageRequestString : MessageSendType.PauseGame.toString(),
      data :  null,
    }
    sendMessage(websocket,msg);
  }
    

 export const sendMessageToServerOnResumeState = (websocket : WebSocket) => {
    let msg:MessageSendInterface = {
      id : null,
      request : MessageSendType.ResumeGame,
      messageRequestString : MessageSendType.ResumeGame.toString(),
      data :  null,
    };
    sendMessage(websocket,msg);
}


export const sendMessageToServerOnNewGameState = (websocket : WebSocket) => {
  let msg:MessageSendInterface = {
    id : null,
    request : MessageSendType.NewGame,
    messageRequestString : MessageSendType.NewGame.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}


export const getAvailableClientsList = (websocket : WebSocket) => {
  let msg:MessageSendInterface = {
    id : null,
    request : MessageSendType.AvailableClients,
    messageRequestString : MessageSendType.AvailableClients.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}


export const sendRequestToAvailableOtherClient = (websocket : WebSocket,clientId : string) => {
  let msg:MessageSendInterface = {
    id : clientId,
    request : MessageSendType.SendRequestToOtherClient,
    messageRequestString : MessageSendType.SendRequestToOtherClient.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}


export const sendAcceptInvitationTotheClient = (websocket : WebSocket,clientId : string) => {
  let msg:MessageSendInterface = {
    id : clientId,
    request : MessageSendType.AcceptInvitation,
    messageRequestString : MessageSendType.AcceptInvitation.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}


export const sendRejectInvitationTotheClient = (websocket : WebSocket,clientId : string) => {
  let msg:MessageSendInterface = {
    id : clientId,
    request : MessageSendType.RejectInvitation,
    messageRequestString : MessageSendType.RejectInvitation.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}


export const requestToServerForSinglePlayerGame = (websocket: WebSocket) => 
{
  let msg:MessageSendInterface = {
    id : null,
    request : MessageSendType.CreateSinglePlayerGame,
    messageRequestString : MessageSendType.CreateSinglePlayerGame.toString(),
    data :  null,
  };
  sendMessage(websocket,msg);
}

export const requestToServerToClearGame = (websocket :WebSocket) => 
{
    let msg:MessageSendInterface = {
      id : null,
      request : MessageSendType.ClearGame,
      messageRequestString : MessageSendType.ClearGame.toString(),
      data :  null,
    };
    sendMessage(websocket,msg);
}
