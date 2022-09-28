// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"
import clientBubbleModel, { ConnectionDetails } from "./ClientBubbleDataModel";
import EventEmitter  from 'events';
import { BubbleInfo, BubbleState, BubblesDataModel, StatusType, GameType, GameState,
     DoublePlayers, SinglePlayer } from "../interfaces/bubbleInterfaces";
import SendMessageModel from "./SendMessagesModel";
import BubbleEventListners from "./BubbleEventListners";
import GenerateBubbles from "./GenerateBubbles";
import ClientBubbleDataModel from "./ClientBubbleDataModel";

/**
 * This class is an API class that manages all the ClientBubble Data Model Operations
*/
class ClientBubbleAPI extends ClientBubbleDataModel{
    
    private sendMessageModel : SendMessageModel;
    private objectBubbblEventListners : BubbleEventListners;
    private objectGenerateBubble : GenerateBubbles;

    constructor() {
        super();
        this.sendMessageModel = new SendMessageModel();
        this.objectBubbblEventListners = new BubbleEventListners();
        this.setBrustEmitter(this.objectBubbblEventListners.burstEmiter);
        this.objectGenerateBubble = new GenerateBubbles();
    }

    /**
     * This methods is used for creating the new client and sending back the clientId
     * @connection WebSocketConnection
    */
    public addClient(connection : WebSocketConnection) : void
    {
       let clientId = this.addNewClient(connection);
       this.sendMessageModel.sendClientId(connection,clientId);
    }

    /**
     * This methods is used for creating new game when a connection made and send to the client. 
     * @connection WebSocketConnection
    */
    public createNewSinglePlayerGame(connection : WebSocketConnection) : void
    {
       let gameId = this.createSinglePlayerGameData(connection);
       let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
       let list: Array<BubbleInfo> = this.objectGenerateBubble.generateBubbles(bubblesData);
       this.sendMessageModel.sendBubblesToClient(connection,list,gameId);
       this.setConnectionGameData(connection,gameId);
       this.setBubblesData(gameId,list);
    }

    /**
     * This methods is used for removing the client connections.
     * @connection WebSocketConnection
    */
    public removeClient(connection : WebSocketConnection) : void
    {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        try {
            if(bubblesData != undefined)
            {
                if(bubblesData.gameType == GameType.DoublePlayer)
                {  
                    this.sendMessageModel.sendRequestToClientToAbortGame(bubblesData,connection);
                }
                this.clearPreviousGame(gameId);
            }
            this.closeClientConnection(gameId,connection);
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * This methods is creating the new game when a player clicks on new game button.
     * @connection WebSocketConnection
    */
    public createNewGame(connection : WebSocketConnection) : void
    {
        let gameId = this.getGameId(connection);
        this.clearPreviousGame(gameId);
        this.createNewSinglePlayerGame(connection);
        this.setClientAvailabilityStatus(connection);
    } 

    /**
     * This methods checks if a bubble is present in the BubbleData.
     * @connection WebSocketConnection @bubbleId string
    */
    public checkBubblePresent(id: string,connection: WebSocketConnection) : boolean
    {
       let gameId = this.getGameId(connection);
       let bubble = this.getBubbleInfoWithId(gameId,id) as BubbleInfo;
       try {
        if(bubble.state == BubbleState.Present)
        {
            return true;
        }
        return false;
       } catch (error) {
         console.log(error);
         return false; 
       }      
    }
    
    /**
     * This methods is used for validates Bubble data.
     * @connection WebSocketConnection
    */
    public validateBubble(bubbleId: string,connection : WebSocketConnection) : void
    {
        if(this.checkBubblePresent(bubbleId,connection) == true)
        {
            this.popBubble(bubbleId, connection);
            this.generatesBubblesAndSetData(connection);
        }
    }

    /**
     * This methods is used for generating the bubbles and storing them in BubbleData.
     * @connection WebSocketConnection
    */
    public generatesBubblesAndSetData(connection: WebSocketConnection) : void
    {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        if(bubblesData.gameType == GameType.SinglePlayer)
        {
            let list: Array<BubbleInfo> = this.objectGenerateBubble.generateBubbles(bubblesData);
            this.sendMessageModel.sendBubblesToClient(connection,list,gameId);
            this.setBubblesData(gameId,list);
        }
        else if(bubblesData.gameType == GameType.DoublePlayer)
        {
            let list: Array<BubbleInfo> = this.objectGenerateBubble.generateBubblesTwoPlayers(bubblesData);
            this.sendMessageModel.sendBubblesDoublePlayer(bubblesData,list,gameId);
            this.setBubblesData(gameId,list);
        }  
    }

    /**
     * This methods is used for validating the bubble and send back the client with an update.
     * @connection WebSocketConnection @bubbleId string
    */
    public popBubble(id: string, connection:WebSocketConnection): void
    {
        let gameId = this.getGameId(connection);
        let bubbleData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        let result = this.removeBubbleInfo(gameId,id,bubbleData);
        if(bubbleData.gameType == GameType.DoublePlayer)
        {
            if(result == true)
            {   
              this.sendMessageModel.sendBubblePopDoublePlayer(id,bubbleData,connection);
            }
        }
        else if(bubbleData.gameType == GameType.SinglePlayer)
        {
            if(result == true)
            {   
               this.sendMessageModel.sendRemovedBubblesData(id,connection);
            }
        }
    }
   
    /**
     * This methods is used for setting the client states available when the bubble brust occures.
     * And also it clears all the timers and bubble data.
     * @connection WebSocketConnection
    */
    public bubbleBrustSuccessful(connection :WebSocketConnection) : void
    {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        if(bubblesData.gameType == GameType.DoublePlayer)
        {
            let connections = bubblesData.connection as DoublePlayers;
            let connection1 = connections.connection1;
            let connection2 = connections.connection2;
            this.setClientUnAvailabilityStatus(connection1);
            this.setClientUnAvailabilityStatus(connection2);
        }
        else if(bubblesData.gameType == GameType.SinglePlayer)
        {
            let connections = bubblesData.connection as SinglePlayer;
            let connection1 = connections.connection;
            this.setClientUnAvailabilityStatus(connection1);
        }
        this.clearPreviousGame(gameId);
    }

    /**
     * This methods is used for clearing the previous game. 
     * @connection WebSocketConnection
    */
    public clearGame(connection : WebSocketConnection) : void {
        let gameId = this.getGameId(connection);
        if(gameId != undefined && gameId != null)
        { 
            this.clearPreviousGame(gameId);
        }
    }

    public bubbleBrustUnSuccessful(connection :WebSocketConnection) : void
    {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
    }

    /**
     * This methods is used for setting the gamestate in pause mode.
     * @connection WebSocketConnection
    */
    public setPauseGame(connection : WebSocketConnection) : void {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        if(bubblesData.gameState == GameState.Pause)
        {
            this.pauseGame(gameId);
            if(bubblesData.gameType == GameType.DoublePlayer)
            {
                this.sendMessageModel.sendRequestToClienToPauseGame(bubblesData,connection);
            }
        }
    }

    /**
     * This methods is used for to resume the game state.
     * @connection WebSocketConnection
    */
    public setResumeGame(connection : WebSocketConnection) : void {
        let gameId = this.getGameId(connection);
        let bubblesData: BubblesDataModel = this.getBubblesData(gameId) as BubblesDataModel;
        if(bubblesData.gameState == GameState.Resume)
        {
            this.resumeGame(gameId);
            if(bubblesData.gameType == GameType.DoublePlayer)
            {
              this.sendMessageModel.sendRequestToClienToResumeGame(bubblesData,connection);
            }
        }
    }
    
    /**
     * This methods is used for get all the available clients list. 
     * @connection WebSocketConnection @bubbleId string
    */
    public getAvailableClientsList(connection : WebSocketConnection) : void {
        let list = this.clientsList(connection);
        this.sendMessageModel.sendAvailableClientsList(connection,list);
    }
    
    /**
     * This methods is used for sending requests from one client to other.
     * @connection WebSocketConnection @clientId string
    */
    public sendRequestToOtherClient(connection:WebSocketConnection,clientId:string): void
    { 
      let otherClientConnection: ConnectionDetails = this.getClientConnection(clientId);
      let ownClientConnection: ConnectionDetails = this.getOwnClientConnectionData(connection);
      let data: ConnectionDetails = {
        websocket : null,
        clientId : ownClientConnection.clientId,
        status : otherClientConnection.status
      }
      this.sendMessageModel.sendRequestToOtherClient(otherClientConnection.websocket,data);
    }

    /**
     * This methods is used for when a requested client accepts the requested invitation. 
     * @connection WebSocketConnection @clientId string
    */
    public acceptInvitation(connection:WebSocketConnection,clientId:string) : void
    {
      let otherClientConnection: ConnectionDetails = this.getClientConnection(clientId);
      if(otherClientConnection.status == StatusType.Available)
      {
        let gameId = this.createDoublePlayerGame(connection,otherClientConnection.websocket);
        let bubbleData = this.getBubblesData(gameId) as BubblesDataModel;
        let list = this.objectGenerateBubble.generateBubblesTwoPlayers(bubbleData);
        this.setBubblesData(gameId,list);
        this.setConnectionGameData(connection,gameId);
        this.setConnectionGameData(otherClientConnection.websocket,gameId);
        this.setClientAvailabilityStatus(connection);
        this.setClientAvailabilityStatus(otherClientConnection.websocket);
        this.sendMessageModel.sendStartGameMessage(connection,gameId,list);
        this.sendMessageModel.sendStartGameMessage(otherClientConnection.websocket,gameId,list);
      }
    }
}
export default ClientBubbleAPI;