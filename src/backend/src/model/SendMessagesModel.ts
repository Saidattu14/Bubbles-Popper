// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"
import { ConnectionDetails } from "./ClientBubbleDataModel";
import { BubbleInfo, BubblesDataModel, DoublePlayers } from "../interfaces/bubbleInterfaces";
import { MessageSendInterface, MessageSendType } from "../interfaces/messageInterfaces";

 /**
 * This is a class that manages in sending messages to the clients.
 */
class SendMessageModel {

    constructor()
    {
   
    }
     /**
     * This method sends the message to the respective connection.
     */
    public sendMessage(connection : WebSocketConnection ,msg: string)
    {

       let pr = new Promise<boolean>((resolve, reject) => {
        if(connection.state == 'open')
        {
            connection.send(msg,(err:any) => {
                if(err != undefined)
                {
                    reject(err);
                }
                else
                {
                    resolve(true);
                }
            });
        }
        else
        {
            console.log(connection.state)
        }
       }).catch((err) => {
        console.log(err);
       });
       return pr;
    }

    /**
     * The method creates a message of the bubbles data and call send message for sending it.
    */
    public async sendBubblesToClient(connection : WebSocketConnection,list: Array<BubbleInfo>,gameId : string)
    {

        let msg: MessageSendInterface = {
            data: list,
            id: gameId,
            messageType: MessageSendType.AddBubbles,
            messageTypeString : MessageSendType.AddBubbles.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1) as boolean;
    }
    
    /**
     * The method creates a message of the removed bubble data and call send message for sending it.
    */
    public async sendRemovedBubblesData(bubbleId: string, connection: WebSocketConnection)
    {
        let msg: MessageSendInterface = {
            data: null,
            id: bubbleId,
            messageType: MessageSendType.RemoveBubble,
            messageTypeString : MessageSendType.RemoveBubble.toString()

        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
        // let pr: boolean =  await this.sendMessage(connection,msg1) as boolean;
        // return pr;
    }
    
    /**
     * The method creates a message of the available clients list data and call send message for sending it.
    */
    public async sendAvailableClientsList(connection : WebSocketConnection,list:any) {
        let msg: MessageSendInterface = {
            data: list,
            id: null,
            messageType: MessageSendType.AvailableClientsListData,
            messageTypeString : MessageSendType.AvailableClientsListData.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
    }
    
    /**
     * The method creates a message of the request invitation data and call send message for sending it.
    */
    public async sendRequestToOtherClient(connection:WebSocketConnection,data:ConnectionDetails)
    { 
        let msg: MessageSendInterface = {
            data: data,
            id: null,
            messageType: MessageSendType.RequestInivitation,
            messageTypeString : MessageSendType.RequestInivitation.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
    }

    /**
     * The method creates a message of the double game start data and call send message for sending it.
    */
    public async sendStartGameMessage(connection: WebSocketConnection,gameId:string,list:Array<BubbleInfo>)
    {
        let msg: MessageSendInterface = {
            data: list,
            id: gameId,
            messageType: MessageSendType.StartDoublePlayerGame,
            messageTypeString : MessageSendType.StartDoublePlayerGame.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
    }
    /**
     * The method creates a messages of the client connection Id data and call send message for sending it.
    */
    public async sendClientId(connection:WebSocketConnection, clientId:string) {
        let msg: MessageSendInterface = {
            data: null,
            id: clientId,
            messageType: MessageSendType.YourId,
            messageTypeString : MessageSendType.YourId.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
    }
      
    /**
     * The method creates a messages of the opponent score update and call send message for sending it.
    */
    public async sendBubblePopOpponentScore(bubbleId:string,connection:WebSocketConnection)
    {
        let msg: MessageSendInterface = {
        data: null,
        id: bubbleId,
        messageType: MessageSendType.RemoveBubbleUpdateOpponentScore,
        messageTypeString : MessageSendType.RemoveBubbleUpdateOpponentScore.toString()
        }
        let msg1:string = JSON.stringify(msg);
        await this.sendMessage(connection,msg1);
    }
     
    /**
     * The method call the bubble popped data in the double player game.
    */
    public async sendBubblePopDoublePlayer(bubbleId:string,bubbleData: BubblesDataModel,connection:WebSocketConnection) {
        let connectionsList = bubbleData.connection as DoublePlayers;
        let connection1 = connectionsList.connection1;
        let connection2 = connectionsList.connection2;

        if(connection == connection1)
        {

            await this.sendRemovedBubblesData(bubbleId,connection1);
            await this.sendBubblePopOpponentScore(bubbleId,connection2);
        }
        else if(connection == connection2)
        {        
            await this.sendRemovedBubblesData(bubbleId,connection2);
            await this.sendBubblePopOpponentScore(bubbleId,connection1);
        }
    }
  
    /**
     * The method creates a messages of the bubble update in double player game and call send message for sending it.
    */
    public async sendBubblesDoublePlayer(bubbleData: BubblesDataModel,list: Array<BubbleInfo>,gameId : string): Promise<void> {
        let connectionsList = bubbleData.connection as DoublePlayers;
        let connection1 = connectionsList.connection1;
        let connection2 = connectionsList.connection2;
        await this.sendBubblesToClient(connection1,list,gameId);
        await this.sendBubblesToClient(connection2,list,gameId);
    }

    /**
     * The method creates a messages of the pause data and call send message for sending it.
    */
    public async sendRequestToClienToPauseGame(bubbleData: BubblesDataModel,connection:WebSocketConnection) {
        let connectionsList = bubbleData.connection as DoublePlayers;
        let connection1 = connectionsList.connection1;
        let connection2 = connectionsList.connection2;
        let msg: MessageSendInterface = {
            data: null,
            id: null,
            messageType: MessageSendType.PauseGame,
            messageTypeString : MessageSendType.PauseGame.toString()
        }
        let msg1:string = JSON.stringify(msg);
        if(connection == connection1)
        {
            await this.sendMessage(connection2,msg1);
        }
        else if(connection == connection2)
        {
            await this.sendMessage(connection1,msg1);
        }
    }
    /**
     * The method creates a messages of the resume data and call send message for sending it.
    */
    public async sendRequestToClienToResumeGame(bubblesData: BubblesDataModel,connection:WebSocketConnection) {
        let connectionsList = bubblesData.connection as DoublePlayers;
        let connection1 = connectionsList.connection1;
        let connection2 = connectionsList.connection2;
        let msg: MessageSendInterface = {
            data: null,
            id: null,
            messageType: MessageSendType.ResumeGame,
            messageTypeString : MessageSendType.ResumeGame.toString()
        }
        let msg1:string = JSON.stringify(msg);
        if(connection == connection1)
        {
          
            await this.sendMessage(connection2,msg1);
        }
        else if(connection == connection2)
        {
            await this.sendMessage(connection1,msg1);
        }
    }

    /**
     * The method creates a messages of the abort game data and call send message for sending it.
    */
    public async sendRequestToClientToAbortGame(bubblesData: BubblesDataModel,connection:WebSocketConnection) {
        let connectionsList = bubblesData.connection as DoublePlayers;
        let connection1 = connectionsList.connection1;
        let connection2 = connectionsList.connection2;
        let msg: MessageSendInterface = {
            data: null,
            id: null,
            messageType: MessageSendType.AbortGame,
            messageTypeString : MessageSendType.AbortGame.toString()
        }
        let msg1:string = JSON.stringify(msg);
        if(connection == connection1)
        {
            await this.sendMessage(connection2,msg1);
        }
        else if(connection == connection2)
        {
            await this.sendMessage(connection1,msg1);
        }
    }
}

export default SendMessageModel;