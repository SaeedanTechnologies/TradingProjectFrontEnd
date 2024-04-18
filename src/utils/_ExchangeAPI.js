import axios from "axios"
import { _API } from "./_API"


export const GetCryptoData = async () => {
    const res = await axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
    return res
}