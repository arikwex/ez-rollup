import logger from './logger.js';
import router from './app/router.js';
import websockets from './app/websockets.js';

router.initialize();
websockets.initialize();
