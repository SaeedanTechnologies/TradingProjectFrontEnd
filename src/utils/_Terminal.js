import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;



export const TerminalLogin = async ({login_id, password})=> {
    const mLogin = await _API(`${apiUrl}/terminal/login`,'post',{login_id, password})
    return mLogin
}

export const GetTerminalSymbolsList   = async (token) => {
    const res = await _API(`${apiUrl}/terminal/symbels`, 'get', [], token)
  return res
}