import axios from "axios"
import { _API } from "./_API"

 
export const GetCryptoData = async () => {
    const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
    return res
}

export const GetAskBidData = async (symbol) => {
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`)
    return res
}