import { connect } from 'react-redux'
import Bubbles from '../components/Bubbles'
import {store} from '../store/configureStore'


const MapStateToProps =  () => ({
    websocket : store.getState().counter.websocket  as WebSocket,
    bubbleList : store.getState().counter.bubbleList,
    gameScore : store.getState().counter.gameScore,
    gameState : store.getState().counter.gameState
});

export default connect(
  MapStateToProps
)(Bubbles)