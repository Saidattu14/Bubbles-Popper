import { RootState, store} from '../store/configureStore'
import { useSelector, useDispatch} from 'react-redux'
import { websocketConnection,BubbleBrustState,
  clearGame} from '../reducers/websocket_reducer'
import {useState,useEffect,} from 'react';
import '../css/Game.css'
import { requestToServerForBubbleBrustedFailed, requestToServerForBubbleBrustedSuccess } from './utils/BubbleState';
import BubbleContainer from '../container.tsx/BubbleContainer';
import { useParams } from 'react-router-dom';
import { getAvailableClientsList, requestToServerForSinglePlayerGame, requestToServerToClearGame, sendMessageToServerOnNewGameState } from './utils/GameState';
import ClientsListContainer from '../container.tsx/ClientsListContainer';
import RequestsListContainer from '../container.tsx/RequestsListContainer';
import ClientDataContainer from '../container.tsx/ClientDataContainer';
import { recieveMessagesHandling } from './utils/RecieveMessage';


 /**
 * This is a functional component manages all the game child components and websockets data.
 */
export function Game() {
  let { gametype } = useParams();
  const websocket = useSelector((state:RootState) => state.counter.websocket);
  const bubbleBrustState = useSelector((state:RootState) => state.counter.bubbleBrustState);
  const bubbleBrustData = useSelector((state:RootState) => state.counter.bubbleBrustData);
  const gameId = useSelector((state:RootState) => state.counter.gameId);
  const [Loading,setLoading] = useState('Loading');
  const [connected,setConnected] = useState(false);
  const dispatch = useDispatch();
  const WebSocketUrl = "ws://localhost:4000/";

  const onError = () => {
    setLoading('Connection Disconnected');
    setConnected(false);
  }


  const recieveMessages = (websocket: WebSocket) => {
    websocket.onmessage = (msg:any) => {
        recieveMessagesHandling(msg,dispatch);
      }
    }


  const closeWebSocket = () => {
    console.log("Closed")  
    setConnected(false);
    setLoading('Connection Disconnected');
    }


  const messageFormatFirst = (e :Event) => {
    if(gametype == 'two-player-game' && gameId == null)
    {
      getAvailableClientsList(e.target as WebSocket);
      setConnected(true);
      dispatch(websocketConnection(e.target as WebSocket));
    }
    else
    {
      requestToServerForSinglePlayerGame(e.target as WebSocket); 
      setConnected(true);
      dispatch(websocketConnection(e.target as WebSocket));
    }
  }


  const setEventListener = (websocket: WebSocket) => {
    websocket.addEventListener('error',onError);
    websocket.addEventListener("open", messageFormatFirst);
    websocket.addEventListener('close',closeWebSocket);
  }

   
   const getWebSocket = async(websocket: WebSocket | null): Promise<WebSocket> => {
    try {
      if(websocket == null)
      {
        websocket = new WebSocket(WebSocketUrl,"echo-protocol");
        setEventListener(websocket);
      }
      else
      {
        setConnected(true);
      }
    } catch (error) {
      console.log(error)
    }
    return websocket as WebSocket;
  }


  const checkBubbleBrustState = (websocket :WebSocket) => {
    if(bubbleBrustState == BubbleBrustState.Brusted)
    {
      requestToServerForBubbleBrustedSuccess(bubbleBrustData?.id as string,websocket as WebSocket);
    }
    else if(bubbleBrustState == BubbleBrustState.Present)
    {
      requestToServerForBubbleBrustedFailed(bubbleBrustData?.id as string,websocket as WebSocket);
    }
  }
  

  const getClientsUpdate = (websocket : WebSocket) => {
    if(gametype == 'two-player-game' && gameId == null)
    {
      getAvailableClientsList(websocket as WebSocket);
    }
    else if(gametype == 'single-player-game' && gameId == null && websocket.readyState == 1)
    { 
      sendMessageToServerOnNewGameState(websocket as WebSocket);
    }
  }

  const setWebSocket = async(websocket : any) => {
    websocket = await getWebSocket(websocket);
    recieveMessages(websocket as WebSocket);
    checkBubbleBrustState(websocket as WebSocket);
    getClientsUpdate(websocket);
  }

  const setupWindow = () => {
    window.addEventListener('popstate',() => {
      let ws = store.getState().counter.websocket;
      requestToServerToClearGame(ws as WebSocket);
      dispatch(clearGame());
    })
  }

  useEffect(() => {
    setWebSocket(websocket);
    setupWindow();
    return() => {
    }
  }, [bubbleBrustData,gameId]);


  if(connected == false)
  {
      return(
        <div style={{color : "palevioletred", margin : 'auto',textAlign:'center'}}>
          {Loading}
        </div>
      )
  }
  else
  {
    if(gameId != null)
    {
       return(
        <BubbleContainer></BubbleContainer>
      );
    }
    else
    {
         if(gametype == 'two-player-game')
         {
          return(
            <div style={{"display" : 'block'}}>
              <ClientDataContainer></ClientDataContainer>
              <div style={{"display" : 'flex'}}>
              <ClientsListContainer></ClientsListContainer>
              <RequestsListContainer></RequestsListContainer>
              </div>
            </div>
          )
         }
         else
         {
          return(
            <div>
            </div>
          )
        }
    }
  }
}
