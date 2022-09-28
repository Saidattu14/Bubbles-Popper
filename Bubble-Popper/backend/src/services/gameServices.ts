// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection";
import { MessageRecieved } from "../interfaces/messageInterfaces";
import ClientBubbleAPI from "../model/ClientBubbleAPI";


class GameServices {
    
    private objectClientBubbleAPI: ClientBubbleAPI;
     constructor ()
     {
        this.objectClientBubbleAPI = new ClientBubbleAPI();
     }

    public validateBubbles(data : MessageRecieved,connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.validateBubble(data.id,connection);
    }

    public generateBubble(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.generatesBubblesAndSetData(connection);   
    }

    public closeClient(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.removeClient(connection);
    }
    
    public addConnection(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.addClient(connection);
    }

    public bubbleSuccessfulBrust(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.bubbleBrustSuccessful(connection);
    }

    public bubbleUnSuccessfulBrust(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.bubbleBrustUnSuccessful(connection);
    }

    public pauseGame(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.setPauseGame(connection);
    }

    public resumeGame(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.setResumeGame(connection);
    }
    
    public createNewGame(connection: WebSocketConnection)
    {
        this.objectClientBubbleAPI.createNewGame(connection);
    }

    public availableClients(connection: WebSocketConnection)
    {
        
        this.objectClientBubbleAPI.getAvailableClientsList(connection);
    }

    public sendRequestToOtherClient(connection:WebSocketConnection, clientId : string)
    {
       this.objectClientBubbleAPI.sendRequestToOtherClient(connection,clientId);
    }
    public acceptOtherClientInvitation(connection:WebSocketConnection, clientId : string)
    {
       this.objectClientBubbleAPI.acceptInvitation(connection,clientId);
    }

    public createSinglePlayerGame(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.createNewSinglePlayerGame(connection);
    }

    public clearGame(connection : WebSocketConnection)
    {
        this.objectClientBubbleAPI.clearGame(connection);
    }
}

const objectGameServices = new GameServices();
export default objectGameServices;
