// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection";
import { MessageRecieved, MessageRecievedType } from "../interfaces/messageInterfaces";
import objectGameServices from "../services/gameServices";

const clientCloseEmitter = (connection : WebSocketConnection): void => {
    
    connection.on('close', function(reasonCode:any, description:any) {
        objectGameServices.closeClient(connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
}

const recieveMessagesEmitter = (connection : WebSocketConnection):void  => {
    connection.on("message",function(message:any) {
        try {
            if (message.type === 'utf8') {
                //console.log('Received Message: ' + message.utf8Data);
                let json:MessageRecieved  =  JSON.parse(message.utf8Data);
                if(json.messageRequestString == MessageRecievedType.BubblePoppedValidate.toString())
                {
                    objectGameServices.validateBubbles(json,connection);
                }
                else if(json.messageRequestString == MessageRecievedType.GenerateBubbles.toString())
                {
                    objectGameServices.generateBubble(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.BrustSuccessful.toString())
                {
                   objectGameServices.bubbleSuccessfulBrust(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.BrustUnsuccessful.toString())
                {
                   objectGameServices.bubbleUnSuccessfulBrust(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.PauseGame.toString())
                {
                    objectGameServices.pauseGame(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.ResumeGame.toString())
                {
                    objectGameServices.resumeGame(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.NewGame.toString())
                {
                    objectGameServices.createNewGame(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.AvailableClients.toString())
                {
                    objectGameServices.availableClients(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.SendRequestToOtherClient.toString())
                {
                    objectGameServices.sendRequestToOtherClient(connection, json.id);
                }
                else if(json.messageRequestString == MessageRecievedType.AcceptInvitation.toString())
                {
                    objectGameServices.acceptOtherClientInvitation(connection, json.id);
                }
                else if(json.messageRequestString == MessageRecievedType.AcceptInvitation.toString())
                {
                    objectGameServices.acceptOtherClientInvitation(connection, json.id);
                }
                else if(json.messageRequestString == MessageRecievedType.CreateSinglePlayerGame.toString())
                {
                    objectGameServices.createSinglePlayerGame(connection);
                }
                else if(json.messageRequestString == MessageRecievedType.ClearGame.toString())
                {
                    objectGameServices.clearGame(connection);
                }
            }
        } catch (error) {
            console.log(error);
        }
      
    });
}

const acceptedConnections = (connection : WebSocketConnection) : void => {
    objectGameServices.addConnection(connection);
}

const originIsAllowed = (origin:any): boolean => {
    return true;
}

const listingClientRequests = (ws : any) : void  => {

    ws.on('request', function(request:any) {
        if (!originIsAllowed(request.origin)) {
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
        }
        try {
            let connection : WebSocketConnection;
            connection = request.accept('echo-protocol', request.origin);
            console.log((new Date()) + ' Connection accepted.');
            acceptedConnections(connection);
            recieveMessagesEmitter(connection);
            clientCloseEmitter(connection);
        } catch (error) {
            console.log(error)
        }        
   })
}
export default listingClientRequests;
