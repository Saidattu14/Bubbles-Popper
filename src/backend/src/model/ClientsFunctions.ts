// @ts-ignore
import WebSocketConnection from "websocket/lib/WebSocketConnection"
import { StatusType } from "../interfaces/bubbleInterfaces";
import { ConnectionDetails } from "./ClientBubbleDataModel";

/**
 * This Class is used For managing the client functions.
*/
class ClientFunctions {
    
    /**
    * This method is used for getting all availble clients.
    */
    public getAvailableClientsList (connectionsList :Array<ConnectionDetails>,connection : WebSocketConnection)
    {
        let arr = new Array();
        connectionsList.forEach((element) => {
            if(element.websocket != connection && element.status == StatusType.Available)
            {
              let obj:ConnectionDetails = {
                clientId : element.clientId,
                status : element.status,
                websocket : null
              }  
              arr.push(obj);
            }
        })
        return arr;
    }

    /**
    * This method is used for getting the specific client connection that matches clientId.
    */
    public getClientConnection(clientId: string,connectionsList: Array<ConnectionDetails>)
    {
        let ele:any;
        connectionsList.forEach((element) => {
            if(element.clientId == clientId)
            {
                ele = element;
            }
        });
        return ele as ConnectionDetails;
    }

    /**
    * This method is used for getting the client connection that matches the connection.
    */
    public getOwnClientConnection(websocket: WebSocketConnection,connectionsList: Array<ConnectionDetails>)
    {
        let ele:any;
        connectionsList.forEach((element) => {
            if(element.websocket == websocket)
            {
                ele = element;
            }
        });
        return ele as ConnectionDetails;
    }

    /**
     * This method is used the setting the connection with availability status of NotAvilable.
    */
    public setAvailabilityStatus(websocket: WebSocketConnection,connectionsList: Array<ConnectionDetails>)
    {
        connectionsList.forEach((element) => {
            if(element.websocket == websocket)
            {
                element.status = StatusType.NotAvailable;
            }
        });
        return connectionsList;
    }

    /**
     * This method is used the setting the connection with availability status of Available
    */
    public setUnAvailabilityStatus(websocket: WebSocketConnection,connectionsList: Array<ConnectionDetails>)
    {
        connectionsList.forEach((element) => {
            if(element.websocket == websocket)
            {
                element.status = StatusType.Available;
            }
        });
        return connectionsList;
    }

    /**
     * This method is used remove the connection from the Connections Lists 
    */
    public removeConnectionFromList(websocket: WebSocketConnection,connectionsList: Array<ConnectionDetails>)
    {
       connectionsList =  connectionsList.filter((element) => element.websocket != websocket);
        return connectionsList;
    }
}

export default ClientFunctions;