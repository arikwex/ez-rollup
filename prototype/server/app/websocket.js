import router from './router.js';
import { parse } from 'url';
import { WebSocketServer } from 'ws';
import logger from '../logger.js';
import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();
const on = emitter.on.bind(emitter);
const emit = emitter.emit.bind(emitter);

let websocketServer;
let activeClients = [];

function onUpgrade(request, socket, head) {
  websocketServer.handleUpgrade(request, socket, head, (websocket) => {
    websocketServer.emit('connection', websocket, request);
  });
}

function onConnection(websocketConnection, request) {
  const { pathname } = parse(request.url);

  if (pathname === '/connect') {
    activeClients.push(websocketConnection);
    logger.success(`Client connected, N = ${activeClients.length}`);

    websocketConnection.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      emit('message', {
        connection: websocketConnection,
        message: parsedMessage
      });
    });

    websocketConnection.on('close', () => {
      activeClients = activeClients.filter((conn) => conn != websocketConnection);
      logger.log(`Client disconnect, N = ${activeClients.length}`);
    });

    websocketConnection.on('error', (err) => {
      console.log('Websocket error:', err);
    });
  } else {
    websocketConnection.close();
    logger.error('Invalid websocket connection path');
  }
}

function broadcast(message) {
  for (const connection of activeClients) {
    connection.send(message);
  }
}

function getNumClients() {
  return activeClients.length;
}

function initialize() {
  websocketServer = new WebSocketServer({
    noServer: true
  });

  const httpServer = router.getServer();
  httpServer.on('upgrade', onUpgrade);
  websocketServer.on('connection', onConnection);

  logger.success('Websocket server configured');
  return websocketServer;
};

export default {
  initialize,
  on,
  broadcast,
  getNumClients
}