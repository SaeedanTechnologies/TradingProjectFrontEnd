import { w3cwebsocket as W3CWebSocket } from 'websocket';

let client;
let currentSymbol;

const BinanceBidAsk = (symbol, connected) => {
  if (symbol == null) {
    // Stop the WebSocket connection if it's active
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Stopping WebSocket connection`);
    }
    return null;
  }

  const WS_URL = `wss://fstream.binance.com/stream?streams=${symbol?.toLowerCase()}@bookTicker`;

  if (typeof WebSocket === 'undefined') {
    console.error('WebSocket is not supported in this environment.');
    return null;
  }

  // Check if the checkbox is not checked
  if (!connected) {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Closing previous WebSocket connection for symbol: ${currentSymbol}`);
    }
    return null;
  }

  // Check if the symbol has changed or if there's no existing connection
  if (symbol !== currentSymbol) {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Closing previous WebSocket connection for symbol: ${currentSymbol}`);
    }
  }

  client = new W3CWebSocket(WS_URL);
  currentSymbol = symbol;
  console.log('Creating new WebSocket connection for symbol:', symbol);

  const onDataReceived = (callback) => {
    if (!client.onmessage) {
      callback({ bidPrice: null, askPrice: null });
    }
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
      console.error(`WebSocket error for symbol ${currentSymbol}:`, error);
      callback(error);
    };
  };

  const onClose = (callback) => {
    client.onclose = () => {
      console.log(`Disconnected from previous Binance stream`);
      callback();
    };
  };

  const onStop = (callback) => {
    client.onclose = () => {
      console.log(`Stopped from previous Binance stream`);
      callback();
    };
  };

  const connect = () => {
    client.onopen = () => {
      console.log(`Connected to new Binance stream for symbol: ${currentSymbol}`);
    };
  };

  const start = (dataCallback, errorCallback, closeCallback) => {
    connect();
    onDataReceived(dataCallback);
    onError(errorCallback);
    onClose(closeCallback);
  };

  const stop = (stopCallback) => {
    onStop(stopCallback);
  };

  return { start, stop };
};

export default BinanceBidAsk;
