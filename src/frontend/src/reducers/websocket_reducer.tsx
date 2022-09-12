import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { BubblesInfo } from '../interfaces/bubbleInterfaces';
import { MessageRecievedInterface } from '../interfaces/messageInterfaces';

export enum StatusType {
  "Available",
  "NotAvailable"
}

export interface ConnectionDetails {
  websocket : WebSocket | null,
  status : StatusType,
  clientId : string,
  request : string
}

export interface GameState {
  websocket : WebSocket | null,
  bubbleList : Array<BubblesInfo>,
  bubbleBrustState : BubbleBrustState | null,
  bubbleBrustData : BubblesInfo | null,
  gameScore : number,
  availableClientsList : Array<ConnectionDetails>,
  requestsClientsList : Array<ConnectionDetails>,
  yourId : string | null,
  gameId : string | null,
  opponentScore : number,
  gameState : string
}


export enum BubbleBrustState {
  "Present",
  "Brusted",
} 

export const initialState: GameState = {
  websocket : null,
  bubbleList : new Array<BubblesInfo>(),
  bubbleBrustState : null,
  bubbleBrustData : null,
  gameScore : 0,
  availableClientsList : new Array<ConnectionDetails>(),
  requestsClientsList : new Array<ConnectionDetails>(),
  yourId : null,
  gameId : null,
  opponentScore : 0,
  gameState : 'Pause',
}

export const websocketReducer = createSlice(
  {
  name: 'websocket',
  initialState,
  reducers: {
    websocketConnection: (state,action: PayloadAction<WebSocket>) => {
      state.websocket = action.payload;
    },

    addYourId :(state,action: PayloadAction<string>) => {
      state.yourId = action.payload;
    },

    addRequesetedClientsList :  (state,action: PayloadAction<ConnectionDetails>) => {
      state.requestsClientsList.push(action.payload);
    },

    addAvailableClientsList :  (state,action: PayloadAction<Array<ConnectionDetails>>) => {
      state.availableClientsList = action.payload;
      state.availableClientsList.filter((e:ConnectionDetails) => {e.request = 'Send Request'})
    },

    addBubbleToList : (state,action: PayloadAction<MessageRecievedInterface>) => {
      let list: Array<BubblesInfo> = action.payload.data as Array<BubblesInfo>;
      for(let i=0; i<list.length;i++)
      {
        state.bubbleList.push(list[i]);
      }
      state.gameId = action.payload.id;
    },

    popBubble: (state,action: PayloadAction<BubblesInfo>) => {
      state.bubbleList = state.bubbleList.filter((e:BubblesInfo) => {
        if(e.id === action.payload.id)
        {
          e.visibility = 'hidden'
        }
        return e;
      });
    },
  
    notifyBrust : (state,action: PayloadAction<string>) => {
      
      state.bubbleList =  state.bubbleList.filter((e:BubblesInfo) => {
        if(e.id === action.payload)
        {
          e.message = 'Expiries In 5 Seconds';
        }
        return e;
      });
    },

    bubbleBrust : (state,action: PayloadAction<string>) => {
     state.bubbleList = state.bubbleList.filter((e:BubblesInfo) => {
        if(e.id === action.payload)
        {
          e.message = 'Time Expired';
          state.bubbleBrustState = BubbleBrustState.Brusted;
          state.bubbleBrustData = e;
          return e;
        }
        else
        {
          e.visibility = 'hidden';
        }
        return e;
      });
    },

    removeBubble : (state,action: PayloadAction<string>) => {
      state.gameScore = state.gameScore + 1;
      state.bubbleList = state.bubbleList.filter((e:BubblesInfo) => e.id != action.payload);
     },

     clearGame : (state) => {
      state.gameScore = 0;
      state.bubbleBrustState = null;
      state.bubbleList = [];
      state.bubbleBrustData = null;
      state.gameId = null;
      state.availableClientsList = [];
      state.requestsClientsList = [];
      state.opponentScore = 0;
     },
     removeBubbleUpdateOpponentScore : (state,action: PayloadAction<string>) => {
      state.opponentScore = state.opponentScore + 1;
      state.bubbleList = state.bubbleList.filter((e:BubblesInfo) => e.id != action.payload);
     },

     updateClientRequest:(state,action:PayloadAction<string>) => {
      state.availableClientsList = state.availableClientsList.filter((e:ConnectionDetails) => {
        if(e.clientId == action.payload)
        {
          e.request = 'Request Sent';
        }
        return e;
      });
     },

     pauseGame : (state) => {
        state.gameState = 'Resume';
      },

      resumeGame :  (state) => {
        state.gameState = 'Pause';
      },

      clearGameId :  (state) => {
        state.gameId = null;
      },
    }
  }
  
)

export const {addYourId,addAvailableClientsList,
  addRequesetedClientsList, websocketConnection,
  popBubble,addBubbleToList,notifyBrust,bubbleBrust,resumeGame,clearGameId,
  removeBubble,clearGame, removeBubbleUpdateOpponentScore,updateClientRequest,pauseGame
} = websocketReducer.actions
export default websocketReducer;