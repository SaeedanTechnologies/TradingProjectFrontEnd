import { _API } from "./_API";
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Trading_Account_Group_List = async(token) =>{
  const res = await _API(`${apiUrl}/admin/trading_account_groups`,'get',[],token)
   return res
}

export const ALL_Trading_Account_Group_List = async(token) =>{
  const res = await _API(`${apiUrl}/admin/getAllTradingGroupList`,'get',[],token)
   return res
}

export const SaveTradingAccountGroups = async(TradingAccountGroupData, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_account_groups`,'post',TradingAccountGroupData, token)
  return res 
}
export const UpdateTradingAccountGroups = async(TradingGroupID,TradingGroupData, token)=>{
  const queryParams = new URLSearchParams(TradingGroupData).toString();
  const url = `${apiUrl}/admin/trading_account_groups/${TradingGroupID}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res 

}
export const SelectTradingAccountGroupWRTID = async(id,token) =>{
  const res = await _API(`${apiUrl}/admin/trading_account_groups/${id}`,'get',[],token)
  return res
}
export const DeleteTradingAccountGroup = async(id, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_account_groups/${id}`,'delete',[],token)
  return res
}

export const getAllTradingAccountsNotInGroup = async(token) =>{
  const res = await _API(`${apiUrl}/admin/getAllTradingAccountsNotInGroup`,'get',[],token)
   return res
}