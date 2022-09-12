import { randomUUID } from "crypto";
import { Queue } from "queue-typescript";
import { BubblesDataModel,DoublePlayers, GameState, GameType, SinglePlayer } from "../interfaces/bubbleInterfaces";
// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"

/**
 * This Class is used for creating GameValues
*/
class GameValues {

    constructor()
    {

    }

    /**
     * The method create a double player game value
     * @connection1 @connection2
     * @return BubbleData of double player datatypes
    */
    public createDoublePlayerGame(connection1: WebSocketConnection,connection2: WebSocketConnection)
    {
        let ws:DoublePlayers = {
            connection1 : connection1,
            connection2 : connection2
        }
        let value : BubblesDataModel = {
            poppedCount: 0,
            currentBubbles: 0,
            previousSizeOfBubbles: 0,
            bubblesHashMap: new Map(),
            bubblesQueue: new Queue(),
            bubblesSchedulerQueue: new Queue(),
            pauseData: new Queue(),
            gameId: randomUUID().toString(),
            connection: ws,
            gameType: GameType.DoublePlayer,
            gameState: GameState.Pause
        };
       return value;
    }
    /**
     * The method create a single player game value
     * @connection
     * @return BubbleData of single player datatypes
    */
    public createSinglePlayerGameData(connection:WebSocketConnection)
    {
        let ws:SinglePlayer = {
            connection : connection,
        }
        let value : BubblesDataModel= {
            poppedCount: 0,
            currentBubbles: 0,
            previousSizeOfBubbles: 0,
            bubblesHashMap : new Map(),
            bubblesQueue : new Queue(),
            bubblesSchedulerQueue : new Queue(),
            pauseData : new Queue(),
            gameId : randomUUID().toString(),
            connection : ws,
            gameType : GameType.SinglePlayer,
            gameState : GameState.Pause
        };
        return value;   
    }
}

export default GameValues;