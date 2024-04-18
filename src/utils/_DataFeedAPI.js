import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const GetDataFeeds = async(token) =>{
  const res = await _API(`${apiUrl}/admin/data_feed`,'get',[],token)
   return res
}