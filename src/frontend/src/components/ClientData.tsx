import '../css/clientData.css';
export interface ClientDataProps {
  yourId : string
}

 /**
 * This is a functional component renders the ui with clientId
 */
export function ClientData ({ yourId }: ClientDataProps) {
    return(
      <div className="body">
      <div style={{color : "palevioletred",textAlign:'center'} }>Your ClientId</div>  
      <div style={{color : "palevioletred"}}>
          <div>{yourId}</div>
      </div>
      </div>
    )
}

export default ClientData;