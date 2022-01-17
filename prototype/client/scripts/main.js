console.log('It works!');

const ws = new WebSocket('/connect');
ws.onopen = () => console.log('Connected!');
ws.onclose = () => console.warn('Closed');
ws.onerror = () => console.error('Error');
