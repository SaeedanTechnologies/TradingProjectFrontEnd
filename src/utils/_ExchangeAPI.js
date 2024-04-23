import axios from "axios"
import { _API } from "./_API"


export const GetCryptoData = async () => {
    const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
    return res
}
export const GetFasciData = async (access_key) => {
    const res = await axios.get(`https://fcsapi.com/api-v3/forex/list?type=forex&access_key=${access_key}`)
    return res
}


export const GetAskBidData = async (symbol) => {
    const res = await axios.get(`https://api.binance.com/api/v3/ticker/bookTicker?symbol=${symbol}`)
    return res
}