import { store} from '../store/configureStore'
import {clearGame, pauseGame, popBubble, resumeGame} from '../reducers/websocket_reducer'
import '../css/Game.css'
import { BubblesInfo } from '../interfaces/bubbleInterfaces';
import styled from 'styled-components'
import { requestToServerToClearGame, sendMessageToServerOnPauseState, sendMessageToServerOnResumeState } from './utils/GameState';
import { requestToServerForBubblePoppedValidation } from './utils/BubbleState';
import { useParams } from 'react-router-dom';


interface BubbleProps {
  bubbleList : Array<BubblesInfo>
  websocket : WebSocket,
  gameScore : number,
  gameState : string
}

 /**
 * This is a functional component manages all the Bubbles Data
 */
export function Bubbles({ bubbleList,websocket,gameScore,gameState }: BubbleProps) {
 
  const Button = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    margin: 10px;
    padding: 0.25em 1em;
    `;
  const bubblePopped = (bubble: BubblesInfo) => {
    if(gameState == 'Pause')
    {
      if(bubble.message != 'Time Expired')
      {
        store.dispatch(popBubble(bubble));
        requestToServerForBubblePoppedValidation(bubble,websocket as WebSocket);
      }
    }
  }

  const updateGameState = () => {
      if(gameState == 'Pause')
      {
        store.dispatch(pauseGame());
        setPause();
      }
      else if(gameState == 'Resume')
      {
        store.dispatch(resumeGame());
        setResume();
      }
  }

  const setPause = () => {
   sendMessageToServerOnPauseState(websocket as WebSocket);
  }

  const setResume = () => {
     sendMessageToServerOnResumeState(websocket as WebSocket);
  }


  return(
      <div>
            <div className='header'>
              <Button>My Score {gameScore} </Button>
              <Button onClick={() => updateGameState()}>{gameState}</Button>
              <NewGame ws = {websocket}></NewGame>
              <Score></Score>
            </div>
            <div className='box'>
            {
             bubbleList.map((bubble) => {  
              if(bubble.visibility == 'visible' || bubble.visibility == undefined)
                return (   
                  <div  key={bubble.id}  className='shape1'>
                  <div onClick = {() => bubblePopped(bubble)} className='shape' style={{
                    backgroundColor : bubble.color,
                    top : bubble.width,
                    left : bubble.height,
                  }}>
                  <div style={{
                      backgroundColor : bubble.color,
                      width: "100%",
                      textAlign : "center",
                      color : "white",
                      top : "30%",
                      fontSize : "11px",
                      position : 'relative',
                      borderRadius : "50%",
                    }}
                      >{bubble.message}</div>
                  </div>
                  </div>
              )})
            }
            </div>
      </div>
    )
}


function Score() {

  const Button = styled.button`
        background: transparent;
        border-radius: 3px;
        border: 2px solid palevioletred;
        color: palevioletred;
        margin: 10px;
        padding: 0.25em 1em;
        `;
  let { gametype } = useParams();
  let opponentScore = store.getState().counter.opponentScore;
  if(gametype == 'two-player-game')
  {
  return(
    <Button>Oppoent Score {opponentScore}</Button>
  )
  }
  else
  {
    return(
      <></>
    )
  }
}

function NewGame(websocket:any) {
  const Button = styled.button`
            background: transparent;
            border-radius: 3px;
            border: 2px solid palevioletred;
            color: palevioletred;
            margin: 10px;
            padding: 0.25em 1em;
            `;
  let { gametype } = useParams();
  const setNewGame = () => {
    requestToServerToClearGame(websocket.ws as WebSocket);
    store.dispatch(clearGame())
  }
  if(gametype == 'two-player-game')
  {
  return(
    <></>
  )
  }
  else
  {
    return(
      <Button onClick={() => setNewGame()}>New Game</Button>
    )
  }
}




export default Bubbles;