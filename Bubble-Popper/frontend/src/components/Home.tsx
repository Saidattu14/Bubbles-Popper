import "../css/Home.css";
import styled from 'styled-components'
import {useNavigate } from 'react-router-dom';

 /**
 * This is a functional component renders the Home page in the ui
 */
export function Home() {

    let navigate = useNavigate();
    const Button = styled.button`
    background: transparent;
    border-radius: 3px;
    border: 2px solid palevioletred;
    color: palevioletred;
    margin: 10px;
    padding: 0.25em 1em;
    width : 150px;
    height : 30px;
  `;
  return (
      <div className='home'>
          <div>{}</div>
          <Button onClick={() => {
            let gametype = 'single-player-game';
            navigate(`/game/${gametype}`);
          }}>Single Player</Button>
          <Button onClick={() => {
             let gametype = 'two-player-game';
             navigate(`/game/${gametype}`);
          }}>Two Player</Button>
      </div>
  )
}
