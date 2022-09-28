import styled from "styled-components";
import { ConnectionDetails, updateClientRequest } from "../reducers/websocket_reducer"
import { store } from "../store/configureStore";
import '../css/ClientList.css';
import { sendRequestToAvailableOtherClient } from "./utils/GameState";

export interface ClientListProps {
  clientsList : Array<ConnectionDetails>
  websocket : WebSocket,
}

 /**
 * This is a functional child component of Game. And manages the clients list and  renders the ui with clients details.
 */
export function ClientsList({ clientsList,websocket}: ClientListProps) {
  const sendRequest = (clientId : string, request : string) => {
      if(request === 'Send Request')
      {
        sendRequestToAvailableOtherClient(websocket,clientId);
        store.dispatch(updateClientRequest(clientId));
      }
  }

  const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  color: palevioletred;
  margin: 10px;
  padding: 0.25em 1em;
`;
    return(
      <div className="body">
      <div className="header1" style={{"color" : "palevioletred","textAlign":'center',}}>
        Clients Available Data</div>
      <div className='header2'>
          {
            clientsList.map((client) => {         
                return (
                  <div  key={client.clientId} className= 'item' style={{"color" : "palevioletred","display" : 'flex'}}>
                    <div style={{"marginTop":"10px"}}>ClientId : {client.clientId}</div>
                    <Button onClick={() => sendRequest(client.clientId, client.request)}>{client.request}</Button>
                  </div>
                );
            })
          }
      </div>
      </div>
  )
}
export default ClientsList;