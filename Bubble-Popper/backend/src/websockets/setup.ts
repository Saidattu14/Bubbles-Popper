import { Server } from "http";
// @ts-ignore
import WebSocketServer from "websocket/lib/WebSocketServer";


const ws = (server : Server): any => {
    var wsServer : WebSocketServer;
    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    })
    return wsServer;
}

export default ws;