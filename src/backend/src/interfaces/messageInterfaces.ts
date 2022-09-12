import { ConnectionDetails } from "../model/ClientBubbleDataModel";
import { BubbleInfo } from "./bubbleInterfaces";

   export enum MessageRecievedType {
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
    "ClearGame",
   }
  

    export interface MessageRecieved
    {
        request : MessageRecievedType,
        id : string,
        messageRequestString : string,
        data :  Array<BubbleInfo> | null,
    }

    export enum GenerateBubblesInfo {
        "FirstTime",
        "OtherTime"
     }
     
     export enum MessageSendType
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
     
     export interface MessageSendInterface
     {
        messageType : MessageSendType,
        data :  Array<BubbleInfo> | null | Array<ConnectionDetails> | ConnectionDetails,
        id : string | null,
        messageTypeString : string
     }