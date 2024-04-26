import axios from "axios"
import { _API } from "./_API"


export const GetCryptoData = async () => {
    const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
    return res
}
export const GetFasciData = async (access_key) => {


  const formatData = (data, group) => {
    return data.map(item => ({
      id: item?.id, 
      name: item?.symbol ? item?.symbol :item?.name, 
      group: group
    }));
  }
 
      try {
        const forexResponse = await axios.get(`https://fcsapi.com/api-v3/forex/list?type=forex&access_key=${access_key}`);
        const forexData = await forexResponse.data.response;

        const cryptoResponse = await axios.get(`https://fcsapi.com/api-v3/crypto/list?type=crypto&access_key=${access_key}`);
        const cryptoData = await cryptoResponse.data.response;

        const stockResponse = await axios.get(`https://fcsapi.com/api-v3/stock/list?country=United-states&access_key=${access_key}`);
        const stockData = await stockResponse.data.response;

        // Format the data into options array with appropriate structure
         const formattedForexData = formatData(forexData, 'Forex');
         const formattedCryptoData = formatData(cryptoData, 'Crypto');
         const formattedStockData = formatData(stockData, 'Stock')
        const formattedOptions = [...formattedForexData, ...formattedCryptoData, ...formattedStockData];

       return formattedOptions
      } catch (error) {
        console.error('Error fetching data:', error);
        return [];
      }
    
}




export const GetAskBidData = async (symbol) => {
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`)
    return res
}