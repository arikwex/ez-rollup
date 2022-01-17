console.log('It works!');

const websocketURL = location.origin.replace(/^http:/, 'ws:') + '/connect';
const ws = new WebSocket(websocketURL);
ws.onopen = () => console.log('Connected!');
ws.onclose = () => console.warn('Closed');
ws.onerror = () => console.error('Error');
