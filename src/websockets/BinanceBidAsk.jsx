import { w3cwebsocket as W3CWebSocket } from 'websocket';

const BinanceBidAsk = ({ symbol }) => {
  const WS_URL = `wss://fstream.binance.com/stream?streams=${symbol.toLowerCase()}@bookTicker`;
  const client = new W3CWebSocket(WS_URL);

  const onDataReceived = (callback) => {
    client.onmessage = (message) => {
      try {
        const parsedMessage = JSON.parse(message.data);
        const { b, a } = parsedMessage.data;
        callback({ bidPrice: parseFloat(b), askPrice: parseFloat(a) });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  };

  const onError = (callback) => {
    client.onerror = (error) => {
      console.error('Failed to establish WebSocket connection:', error);
      callback(error);
    };
  };

  const onClose = (callback) => {
    client.onclose = () => {
      console.error('WebSocket connection closed unexpectedly');
      callback();
    };
  };

  const connect = () => {
    client.onopen = () => {
      console.log('WebSocket connected');
    };
  };

  const start = (dataCallback, errorCallback, closeCallback) => {
    connect();
    onDataReceived(dataCallback);
    onError(errorCallback);
    onClose(closeCallback);
  };

  const stop = () => {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
    }
  };

  return { start, stop };
};

export default BinanceBidAsk;
