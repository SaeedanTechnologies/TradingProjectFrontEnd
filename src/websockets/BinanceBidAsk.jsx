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

  let WS_URL;

  if(symbol?.feed_name === 'binance'){
    WS_URL = `wss://fstream.binance.com/stream?streams=${symbol?.feed_fetch_name?.toLowerCase()}@bookTicker`;
  }
  else{
    WS_URL = `wss://fcsapi.com/`;
  }

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
  if (symbol?.feed_name === 'binance' ? symbol?.feed_fetch_name : symbol?.feed_fetch_key !== currentSymbol) {
    if (client && client.readyState === WebSocket.OPEN) {
      client.close();
      console.log(`Closing previous WebSocket connection for symbol: ${currentSymbol}`);
    }
  }

  client = new W3CWebSocket(WS_URL);
  currentSymbol = symbol?.feed_name === 'binance' ? symbol?.feed_fetch_name : symbol?.feed_fetch_key;
  console.log('Creating new WebSocket connection for symbol:', symbol?.feed_name === 'binance' ? symbol?.feed_fetch_name : symbol?.feed_fetch_key);

  const onDataReceived = (callback) => {
    if(symbol?.feed_name === 'binance'){
      if (!client.onmessage) {
      callback({ bidPrice: null, askPrice: null });
    }
    client.onmessage = (message) => {
      try {
        const parsedMessage = JSON.parse(message.data);
        const { b, a } = parsedMessage.data;
        callback({ bidPrice:b, askPrice: a });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
    }
    else{
      if (!client.onmessage) {
        callback({ bidPrice: null, askPrice: null });
      }
      client.onmessage = (message) => {
        try {
          const parsedMessage = JSON.parse(message.data);
          // const { b, a } = parsedMessage.data;
          console.log(parsedMessage)
          // callback({ bidPrice:b, askPrice: a });
        } catch (error) {
          console.error('Error parsing message:', error);
        }
        // const data = JSON.parse(e.data);
        // if (data.type === 'data_received') {
        //     // Data contains: Price, ASK price, BID price
        //     console.log(data);
        //     // Add your logic to handle the received data
        // }
    };
    }
    
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
    if(symbol?.feed_name === 'binance'){
      client.onopen = () => {
            console.log(`Connected to new Binance stream for symbol: ${currentSymbol}`);
          };
    }
    else{
      client.onopen = () => {
        console.log(`WebSocket connection established for ${symbol?.feed_name}.`);
        // Verify Your API key on server
        client.send(JSON.stringify({ type: 'heartbeat', api_key: 'lg8vMu3Zi5mq8YOMQiXYgV' }));
  
        // Connect Ids on server
        client.send(JSON.stringify({ type: 'real_time_join', currency_ids: symbol?.feed_fetch_key }));
    };
    }
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
