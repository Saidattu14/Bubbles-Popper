// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"
import {Queue} from 'queue-typescript'
import EventEmitter  from 'events';
import { BubblesDataModel,BubbleSchedulerQueue, BubbleInfo, BubbleState, BubbleTimeState, GameState, PauseData, StatusType } from "../interfaces/bubbleInterfaces";
import { setTimeout } from 'timers';
import { randomUUID } from "crypto";
import BubbleFunctions from './BubbleFuctions'
import GameValues from "./GameValues";
import ClientFunctions from "./ClientsFunctions";
import GameStateFunctions from "./GameStateFunctions";


export interface ConnectionDetails {
    websocket : WebSocketConnection,
    status : StatusType,
    clientId : string
}

/**
    *This class is a ClientBubbleDataModel that manages all the Client (websockets) and Bubbles Data. 
*/

class ClientBubbleDataModel {
    
    private clientBubbles : Map<string, BubblesDataModel>;
    private brustEmitter : EventEmitter;
    private connectionsList : Array<ConnectionDetails>;
    private connectionsHashMap : Map<WebSocketConnection, string>;
    private objectBubbleFunctions : BubbleFunctions;
    private objectGameValues : GameValues;
    private objectClientFunctions : ClientFunctions;
    private objectGameStateFunctions : GameStateFunctions;

    constructor() {
        this.clientBubbles = new Map();
        this.brustEmitter = new EventEmitter();
        this.connectionsList = new Array();
        this.connectionsHashMap = new Map();
        this.objectBubbleFunctions = new BubbleFunctions();
        this.objectGameValues = new GameValues();
        this.objectClientFunctions = new ClientFunctions;
        this.objectGameStateFunctions = new GameStateFunctions();
    }

    /**
     * This method sets the event Emitter object.
     * @brustEmitter EventEmitter
    */    
    protected setBrustEmitter(brustEmitter : EventEmitter) : void
    {
        this.brustEmitter = brustEmitter;
    }
     
    /**
     * This method sets connections Hash that means it contains all connections and their present gameId
     * key = websocket and value = gameId
     * @connection WebSocketConnection @gameId string
    */
    protected setConnectionGameData(websocket : WebSocketConnection, gameId : string) : void
    {
        this.connectionsHashMap.set(websocket,gameId);
    }
    
    /**
     * This method is used for storing the client connection details
     * @connection WebSocketConnection 
    */
    protected addNewClient(connection : WebSocketConnection) : string
    { 
      let connectionDetails:ConnectionDetails = {
        websocket : connection,
        status : StatusType.Available,
        clientId : randomUUID().toString()
      }
      this.connectionsList.push(connectionDetails);
      return connectionDetails.clientId as string;
    }
     

    protected createDoublePlayerGame(connection1: WebSocketConnection,connection2: WebSocketConnection) : string
    {
       let value =  this.objectGameValues.createDoublePlayerGame(connection1,connection2);
       this.clientBubbles.set(value.gameId as string,value as BubblesDataModel);
       return value.gameId as string;
    }

    /**
     * This method create a new single player bubble data model.
     *  And stores it as key pair as gameId and BubblesDataModel
     * @connection WebSocketConnection
    */
    protected createSinglePlayerGameData(connection:WebSocketConnection) : string
    {
        let value:BubblesDataModel =  this.objectGameValues.createSinglePlayerGameData(connection);
        this.clientBubbles.set(value.gameId as string,value as BubblesDataModel);
        return value.gameId as string;   
    }

    /**
     * This method is sets the values of the BubblesDataModel of the gameId
     * It call scheduler for scheduling the expiry timeouts.
     * @gameId string
    */
    protected setBubblesData(gameId: string, bubblesList : Array<BubbleInfo>) : void {
        let bubbleData:BubblesDataModel = this.clientBubbles.get(gameId) as BubblesDataModel;
        bubblesList.sort((a:BubbleInfo, b:BubbleInfo) => a.expiryTime - b.expiryTime);
        this.objectBubbleFunctions.setBubblesData(gameId,bubblesList,bubbleData);
        this.setScheduler(gameId,bubblesList);
    }
    
    /**
     * This method is return BubblesDataModel of the gameId.
     * @gameId string
    */
    protected getBubblesData(gameId : string) : BubblesDataModel {
        
        try {
            return this.clientBubbles.get(gameId) as BubblesDataModel;
        } catch (error) {
            return <BubblesDataModel> {} as BubblesDataModel;
        }
    }

    /**
     * This method loops all overs the list of bubbles list and call setTimer for scheduling the notify.
     * @gameId string @bubblesList bubblesList
    */
    private setScheduler(gameId:string , bubblesList: Array<BubbleInfo>) : void
    {
        for(let i=0; i<bubblesList.length;i++)
        {
            this.setTimer(gameId,bubblesList[i],bubblesList[i].notifyTime-bubblesList[i].createdTime,BubbleTimeState.NotifyTime);
        }
    }

    /**
     * This method is return bubbleInfo of bubbleId
     * @gameId bubbleInfo
    */
    protected getBubbleInfoWithId(gameId:string,id:string) : BubbleInfo
    {
        try {
            return this.clientBubbles.get(gameId)?.bubblesHashMap.get(id) as BubbleInfo;
        } catch (error) {
            return <BubbleInfo> {} as BubbleInfo;
        }
       
    }

    /**
     * This method is return gameId of the client.
     * @connection WebSocket
     * @return string
    */
    protected getGameId(connection : WebSocketConnection) : string
    {
        try {
            return this.connectionsHashMap.get(connection) as string;
        } catch (error) {
            return '';
        }
    }
    
    /**
     * This method is return true or false for the passed bubbleId is pop correctly or not.
     * @gameId bubbleInfo
    */
    protected removeBubbleInfo(gameId:string, id:string,bubblesData:BubblesDataModel) : boolean
    {
        let previousCount = bubblesData.poppedCount;
        this.objectBubbleFunctions.removeBubbleInfo(bubblesData,id);
        if(previousCount == bubblesData.poppedCount)
        {
            return false;
        }
        return true;
    }

    /**
     * This method is creates a timer and stores that time in scheduler queue.
     * After the successfully timeout it callbacks the notify and expiry checks.
     * @gameId string, @bubbleInfo BubbleInfo
    */
    private setTimer(gameId: string,bubbleInfo : BubbleInfo, remainingTime: number,bubbleTimeState : BubbleTimeState) : void
    {
        let timer: ReturnType<typeof setTimeout> = setTimeout(() => {
            this.bubbleBrustNotifyCheck(gameId,bubbleInfo,bubbleTimeState);
        },remainingTime) as  ReturnType<typeof setTimeout>;
        let bubbleSchedulerItem : BubbleSchedulerQueue = {
            timer : timer,
            bubbleInfo : bubbleInfo,
            createdTime : Date.now(),
            bubbleTimeState : bubbleTimeState
        }
        this.clientBubbles.get(gameId)?.bubblesSchedulerQueue.append(bubbleSchedulerItem);
    }
   
    /**
     * This method is a callback function that checks whether bubble is present or not.
     * If it is not present it call for bubble remove and if it is present it call for emiter.
     * @gameId string, @bubbleInfo BubbleInfo @bubbleTimeState
    */
    private bubbleBrustNotifyCheck(gameId:string,bubbleInfo : BubbleInfo, bubbleTimeState:BubbleTimeState)
    {
        try {
            if (bubbleInfo.state == BubbleState.Present)
            {
                 
              this.emitBubbleData(gameId,bubbleTimeState,bubbleInfo);
            }
            else if(bubbleInfo.state == BubbleState.Poped)
            {
              this.removeBubbleKey(gameId,bubbleInfo.id)
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * This method is emits the bubble data based on the TimeState.
     * That means bubble is still present until the notify time is finished and similar with expiry time. 
     * @gameId string, @bubbleInfo BubbleInfo @bubbleTimeState
    */
    private emitBubbleData(gameId:string, bubbleTimeState : BubbleTimeState, bubbleInfo : BubbleInfo)
    {
        let data = this.getBubblesData(gameId);
        if(bubbleTimeState == BubbleTimeState.NotifyTime)
        {
          this.brustEmitter.emit("Notify",data,bubbleInfo.id);
          this.setTimer(gameId,bubbleInfo,5000,BubbleTimeState.ExpiryTime);
        }
        else if(bubbleTimeState == BubbleTimeState.ExpiryTime)
        {
           this.brustEmitter.emit("BubbleExpired",data,bubbleInfo.id);
        }
    }
    /**
     * This method removes bubble key in bubblesHashMap.
     * @gameId string, @bubbleId string
    */
    private removeBubbleKey (gameId:string, bubbleId : string)
    {
        try {
            this.clearBubbleSchedulerTime(gameId,bubbleId)
            this.clientBubbles.get(gameId)?.bubblesHashMap.delete(bubbleId);
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * This method clear the schedule timeouts of all the bubble that is popped.
     * @gameId string, @bubbleId string
    */
    private clearBubbleSchedulerTime(gameId: string, bubbleId : string) : void
    {
        let queue:Queue<BubbleSchedulerQueue> = this.clientBubbles.get(gameId)?.bubblesSchedulerQueue as Queue<BubbleSchedulerQueue>;
        this.objectBubbleFunctions.clearBubbleSchedulerTime(queue,bubbleId);
    }
     
    /**
     * This method clears the previous game of the connection 
     * @gameId string
    */
    protected clearPreviousGame(gameId : string) : void
    {
        let bubblesData :BubblesDataModel =  this.clientBubbles.get(gameId) as BubblesDataModel;
        this.objectBubbleFunctions.clearPreviousGameBubbleData(bubblesData);
    }
   
    /**
     * This method pauses scheduled timeouts of the bubbles data
     * @gameId string, @bubbleData BubbleDataModel
    */
    protected pauseGame(gameId:string) : void
    { 
        let bubblesData :BubblesDataModel =  this.clientBubbles.get(gameId) as BubblesDataModel;
        let pauseBubblesData: Queue<PauseData> =  bubblesData.pauseData as Queue<PauseData>
        let queue:Queue<BubbleSchedulerQueue> =  bubblesData.bubblesSchedulerQueue as Queue<BubbleSchedulerQueue>;
        bubblesData.gameState = GameState.Resume;
        this.objectGameStateFunctions.pauseGame(pauseBubblesData,queue)
    }

    /**
     * This method resumes scheduled timeouts of the bubbles data
     * @gameId string, @bubblesData BubblesDataModel
    */
    protected resumeGame(gameId:string) : void
    { 
        let bubblesData :BubblesDataModel =  this.clientBubbles.get(gameId) as BubblesDataModel;
        let arr : Queue<PauseData> =  bubblesData.pauseData as Queue<PauseData>;
        bubblesData.gameState = GameState.Pause;
        arr.toArray().forEach((element) => {
            this.setTimer(gameId,element.bubbleInfo,element.remainingTime,element.bubbleTimeState);
        });
    }
    
    /**
     * This method delete all the information when a client disconnected from game
     * @gameId string, @connection WebSocketConnection
    */
    protected closeClientConnection(gameId : string,connection: WebSocketConnection) : void
    {
       try {
        if(gameId == undefined || gameId == null)
        {
            this.objectClientFunctions.removeConnectionFromList(connection,this.connectionsList);
        }
        else
        {  
            this.clientBubbles.delete(gameId);
            this.objectClientFunctions.removeConnectionFromList(connection,this.connectionsList);
            this.connectionsHashMap.delete(connection);
        }
      
       } catch (error) {
        console.log(error);
       }
    }

    /**
     * This method returns all the connections that are available 
     * @connection WebSocketConnection
    */
    protected clientsList(connection : WebSocketConnection) : Array<ConnectionDetails>
    {
        return this.objectClientFunctions.getAvailableClientsList(this.connectionsList,connection);
    }

    /**
     * This method returns connection of input Id
     * @clientId string
    */
    protected getClientConnection(clientId:string) : ConnectionDetails
    {
        return this.objectClientFunctions.getClientConnection(clientId,this.connectionsList) as ConnectionDetails;
    }
    
    /**
     * This method returns the client ID based on connection
     * @connection WebSocketConnection
    */
    protected getOwnClientConnectionData(connection: WebSocketConnection) : ConnectionDetails
    {
        return this.objectClientFunctions.getOwnClientConnection(connection,this.connectionsList) as ConnectionDetails;
    }

    /**
     * This method sets the cilent availability status  from  available to unavailable
     * @connection WebSocketConnection
    */
    protected setClientAvailabilityStatus(connection : WebSocketConnection) : void
    {
        this.objectClientFunctions.setAvailabilityStatus(connection,this.connectionsList);
    }
    
    /**
     * This method  sets the cilent availability status  from  unavailable to available
     * @connection WebSocketConnection
    */
    protected setClientUnAvailabilityStatus(connection : WebSocketConnection) : void
    {
        this.objectClientFunctions.setUnAvailabilityStatus(connection,this.connectionsList);
    }
}
export default ClientBubbleDataModel;