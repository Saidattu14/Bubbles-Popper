import { connect } from 'react-redux'
import ClientData from '../components/ClientData';
import ClientsList from '../components/ClientsList';
import {store} from '../store/configureStore'


const MapStateToProps =  () => ({
    yourId : store.getState().counter.yourId as string,
});

export default connect(
  MapStateToProps
)(ClientData)