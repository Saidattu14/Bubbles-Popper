import express from 'express';
import ws  from './websockets/setup';
import recieveMessages from './websockets/recieveMessage';
const app = express()



//app.use(express.static('frontend/build/'))


const server = app.listen(4000, () => {
  console.log('App running on localhost:4000');
});


const websocket = ws(server);
recieveMessages(websocket);