import EventEmitter from "events";
import { BubblesDataModel, DoublePlayers, GameType, SinglePlayer } from "../interfaces/bubbleInterfaces";
import { MessageSendInterface, MessageSendType } from "../interfaces/messageInterfaces";
// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"

/**
 * This class is used for the managing the Bubble Events
 * There are two Bubble Events 1) Notify 2) Expired
*/
class BubbleEventListners {
    
    public burstEmiter : EventEmitter;
    constructor()
    {
       this.burstEmiter = new EventEmitter();
       this.bubbleExpiredEventListener();
       this.bubbleBrustNotifyEmitterListener();
    }

    /**
     * This is expiry Event. This is fired when a client bubble time has expired.
     * The call back function has Bubbles data and bubbleId.
     * From the BubblesData it retrives the connections and send messages to them.
    */
    public bubbleExpiredEventListener() : void
    {
        this.burstEmiter.on("BubbleExpired", function(data:BubblesDataModel, id:string) {
            
            function sendmsg(websocket : WebSocketConnection)
            {
                if(websocket.state == 'open')
                {
                    let msg: MessageSendInterface = {
                        data: null,
                        id: id,
                        messageType: MessageSendType.BrustBubble,
                        messageTypeString : MessageSendType.BrustBubble.toString()
                    }
                    let msg1:string = JSON.stringify(msg);

                    websocket.send(msg1,(err:any) => {
                        console.log(err)
                    });
                }
            }

            if(data.gameType == GameType.SinglePlayer)
            {
               let connection = data.connection as SinglePlayer;
               let websocket = connection.connection as WebSocketConnection;
               sendmsg(websocket);
            }
            else if(data.gameType == GameType.DoublePlayer)
            {
                let connection = data.connection as DoublePlayers;
                let connection1 = connection.connection1 as WebSocketConnection;
                let connection2 = connection.connection2 as WebSocketConnection;
                sendmsg(connection2);
                sendmsg(connection1);
            }
        });
    }

    /**
     * This is notify Event. This event is fired when the bubble timer reaches the notify time.
     * The call back function has Bubbles data and bubbleId.
     * From the BubblesData it retrives the connections and send messages to them.
    */
    public bubbleBrustNotifyEmitterListener():void {
        this.burstEmiter.on("Notify", function(data:BubblesDataModel, id:string) {
            //console.log("notified")
            function sendmsg(websocket : WebSocketConnection)
            {
                if(websocket.state == 'open')
                {
                let msg: MessageSendInterface = {
                    data: null,
                    id: id,
                    messageType: MessageSendType.Notify,
                    messageTypeString : MessageSendType.Notify.toString()
                }
                let msg1:string = JSON.stringify(msg);
                websocket.send(msg1,(err:any) => {
                    console.log(err)
                });
                }
            }

            if(data.gameType == GameType.SinglePlayer)
            {
               let connection = data.connection as SinglePlayer;
               let websocket = connection.connection as WebSocketConnection;
               sendmsg(websocket);
            }
            else
            {
                let connection = data.connection as DoublePlayers;
                let connection1 = connection.connection1 as WebSocketConnection;
                let connection2 = connection.connection2 as WebSocketConnection;
                sendmsg(connection2);
                sendmsg(connection1);
            }
        })
    }

}

export default BubbleEventListners;
