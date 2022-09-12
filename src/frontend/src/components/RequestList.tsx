import { useState } from "react";
import styled from "styled-components";
import { ConnectionDetails } from "../reducers/websocket_reducer"
import '../css/ClientList.css';
import { sendAcceptInvitationTotheClient, sendRejectInvitationTotheClient } from "./utils/GameState";

export interface requestClientListProps {
  requestsList : Array<ConnectionDetails>
  websocket : WebSocket,
  
}

 /**
 * This is a functional component of Game. And manages the requests list and  renders the ui with request details.
 */
export function RequestsList({ requestsList,websocket}: requestClientListProps) {

  const [invitationPostivie,SetInvitationPositive] = useState('Accept'); 
  const [invitationNegative, SetInvitationNegative] = useState('Reject');


  const updateInvitationPostive = (clientId: string) => {
    if(invitationPostivie != 'Accepted Done')
    {
        sendAcceptInvitationTotheClient(websocket,clientId);
        SetInvitationPositive('Accepted Done');
    }
  }

  const updateInvitationNegative = (clientId:string) => {
    if(invitationNegative != 'Rejected Done')
    {
       sendRejectInvitationTotheClient(websocket,clientId);
       SetInvitationNegative('Rejected Done');
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
      <div className="header1" style={{"color" : "palevioletred","textAlign":'center'} }>Requests From Available Clients</div>  
      <div className='header2'>
          {
            requestsList.map((client) => {         
                return (
                  <div  key={client.clientId} className= 'item' style={{"color" : "palevioletred","display" : 'flex'}}>
                    <div style={{"marginTop":"10px"}}>ClientId : {client.clientId}</div>
                    <Button onClick={() => updateInvitationPostive(client.clientId)}>{invitationPostivie}</Button>
                    <Button onClick={() =>  updateInvitationNegative(client.clientId)}>{invitationNegative}</Button>
                  </div>
                );
            })
          }
      </div>
      </div>
    )
}

export default RequestsList;