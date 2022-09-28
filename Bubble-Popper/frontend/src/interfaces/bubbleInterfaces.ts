export enum BubbleState
{
   "Poped",
   "Present"
}

export interface BubblesInfo {
    visibility: string;
    message: string;
    id : string,
    color : string,
    expiryTime : number,
    state : BubbleState,
    createdTime : number,
    notifyTime : number,
    height : number,
    width : number
}