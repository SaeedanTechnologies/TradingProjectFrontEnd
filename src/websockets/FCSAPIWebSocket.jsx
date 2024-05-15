import { w3cwebsocket as W3CWebSocket } from 'websocket';

const establishWebSocketConnection = (apiKey, currencyIds) => {
    const socket = new W3CWebSocket('wss://fcsapi.com');

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    socket.onopen = function() {
        // Verify Your API key on server
        socket.send(JSON.stringify({ type: 'heartbeat', api_key: 'lg8vMu3Zi5mq8YOMQiXYgV' }));

        // Connect Ids on server
        socket.send(JSON.stringify({ type: 'real_time_join', currency_ids: currencyIds }));
    };

    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data.type === 'data_received') {
            // Data contains: Price, ASK price, BID price
            console.log(data);
            // Add your logic to handle the received data
        }
    };

    socket.onclose = function() {
        console.log('WebSocket connection closed.');
    };

    return () => {
        socket.close();
    };
};

export default establishWebSocketConnection;
