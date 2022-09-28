import { Dispatch } from "redux";
import { MessageRecievedInterface, MessageRecievedType } from "../../interfaces/messageInterfaces";
import { addBubbleToList, bubbleBrust, notifyBrust, removeBubble, addAvailableClientsList, ConnectionDetails, addYourId, addRequesetedClientsList, removeBubbleUpdateOpponentScore, pauseGame, resumeGame, clearGame } from "../../reducers/websocket_reducer";

export const recieveMessagesHandling = (msg:any,dispatch:Dispatch) => {
   try {
    msg= JSON.parse(msg.data) as MessageRecievedInterface;
    if(msg.messageTypeString == MessageRecievedType.AddBubbles.toString())
    {
      dispatch(addBubbleToList(msg))
    }
    else if(msg.messageTypeString == MessageRecievedType.BrustBubble.toString())
    { 
      dispatch(bubbleBrust(msg.id));
        
    }
    else if(msg.messageTypeString == MessageRecievedType.Notify.toString())
    {
      dispatch(notifyBrust(msg.id))
    }
    else if(msg.messageTypeString == MessageRecievedType.RemoveBubble.toString())
    {
      dispatch(removeBubble(msg.id as string))
    }
    else if(msg.messageTypeString == MessageRecievedType.AvailableClientsListData.toString())
    {
       dispatch(addAvailableClientsList(msg.data as Array<ConnectionDetails>));
    }
    else if(msg.messageTypeString == MessageRecievedType.YourId.toString())
    {
      dispatch(addYourId(msg.id as string));
    }
    else if(msg.messageTypeString == MessageRecievedType.RequestInivitation.toString())
    {
      dispatch(addRequesetedClientsList(msg.data as ConnectionDetails));
    }
    else if(msg.messageTypeString == MessageRecievedType.StartDoublePlayerGame.toString())
    {
       dispatch(addBubbleToList(msg));
    }
    else if(msg.messageTypeString == MessageRecievedType.RemoveBubbleUpdateOpponentScore.toString())
    {
      dispatch(removeBubbleUpdateOpponentScore(msg.id as string));
    }
    else if(msg.messageTypeString == MessageRecievedType.PauseGame.toString())
    {
      dispatch(pauseGame());
    }
    else if(msg.messageTypeString == MessageRecievedType.ResumeGame.toString())
    {
      dispatch(resumeGame());
    }
    else if(msg.messageTypeString == MessageRecievedType.AbortGame.toString())
    {
      dispatch(clearGame());
    }

  } catch (error) {
     console.log(error);  
 }
}