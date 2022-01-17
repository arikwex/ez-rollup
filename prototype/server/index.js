import logger from './logger.js';
import router from './app/router.js';
import websockets from './app/websocket.js';

router.initialize();
websockets.initialize();
