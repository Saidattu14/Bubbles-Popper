import { Queue } from "queue-typescript";
// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"
export enum BubbleState
{
   "Poped",
   "Present"
}

export interface BubbleInfo {
    id : string,
    color : string,
    expiryTime : number,
    state : BubbleState,
    createdTime : number,
    notifyTime : number,
    height : number,
    width : number,
    visibility: string;
    
}

export enum BubbleTimeState {
    "NotifyTime",
    "ExpiryTime"
}


export interface PauseData {

    remainingTime : number,
    callBackFunction : Function,
    bubbleInfo : BubbleInfo,
    bubbleTimeState : BubbleTimeState

}

export interface BubbleSchedulerQueue {

    timer :  ReturnType<typeof setTimeout>,
    bubbleInfo : BubbleInfo,
    createdTime : number,
    bubbleTimeState : BubbleTimeState
}


export enum GameType {

  "SinglePlayer",
  "DoublePlayer"
}

export enum StatusType {

    "Available",
    "NotAvailable"
  }


export interface DoublePlayers {

    connection1 : WebSocketConnection,
    connection2 : WebSocketConnection
}

export interface SinglePlayer {
    connection : WebSocketConnection
}

export enum GameState {
    "Resume",
    "Pause"
}
export interface BubblesDataModel
{
    poppedCount: number,
    currentBubbles : number,
    previousSizeOfBubbles : number,
    bubblesHashMap : Map<string,BubbleInfo>,
    bubblesQueue : Queue<BubbleInfo>,
    bubblesSchedulerQueue : Queue<BubbleSchedulerQueue>,
    pauseData : Queue<PauseData>,
    gameId : string,
    connection : SinglePlayer | DoublePlayers,
    gameType : GameType,
    gameState : GameState
}