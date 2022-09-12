import { connect } from 'react-redux'
import RequestsList from '../components/RequestList';
import {store} from '../store/configureStore'


const MapStateToProps =  () => ({
    websocket : store.getState().counter.websocket  as WebSocket,
    requestsList : store.getState().counter.requestsClientsList,
});

export default connect(
  MapStateToProps
)(RequestsList)