import { _API } from "./_API";
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Trading_Account_Group_List = async(token) =>{
  const res = await _API(`${apiUrl}/admin/trading_account_groups`,'get',[],token)
   return res
}