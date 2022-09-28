import { BubblesInfo } from "./bubbleInterfaces";

   export enum MessageSendType {
    "BubblePoppedValidate",
    "GenerateBubbles",
    "BrustSuccessful",
    "BrustUnsuccessful",
    "PauseGame",
    "ResumeGame",
    "NewGame",
    "AvailableClients",
    "SendRequestToOtherClient",
    "AcceptInvitation",
    "RejectInvitation",
    "CreateSinglePlayerGame",
    "ClearGame"
   }
  

    export interface MessageSendInterface
    {
        request : MessageSendType,
        id : string | null,
        messageRequestString : string,
        data :  Array<BubblesInfo> | null,
    }

     
     export enum MessageRecievedType
     {
         "AddBubbles",
         "RemoveBubble",
         "Notify",
         "BrustBubble",
         "AvailableClientsListData",
         "YourId",
         "RequestInivitation",
         "StartDoublePlayerGame",
         "RemoveBubbleUpdateOpponentScore",
         "PauseGame",
         "ResumeGame",
         "AbortGame"
     }
     
     export interface MessageRecievedInterface
     {
        messageType : MessageSendType,
        data :  Array<BubblesInfo> | null,
        id : string | null,
        score : number,
        messageTypeString : string
    }