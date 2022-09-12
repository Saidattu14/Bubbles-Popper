import { connect } from 'react-redux'
import ClientsList from '../components/ClientsList';
import {store} from '../store/configureStore'


const MapStateToProps =  () => ({
    websocket : store.getState().counter.websocket  as WebSocket,
    clientsList : store.getState().counter.availableClientsList,
});

export default connect(
  MapStateToProps
)(ClientsList)