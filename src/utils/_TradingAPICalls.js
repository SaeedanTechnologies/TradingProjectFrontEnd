import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Trading_Accounts_List = async(token) =>{
  const mBrands = await _API(`${apiUrl}/admin/trading_accounts`,'get',[],token)
   return mBrands
}

export const Save_Trading_Account = async(TradingAccountData, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_accounts`,'post',TradingAccountData, token)
  return res 
}

export const Delete_Trading_Account = async(TradingID, token)=>{
  const res = await _API(`${apiUrl}/admin/trading_accounts/${TradingID}`,'delete',[],token)
  return res
}


export const Get_Trade_Order = async(trading_account_id,OrderType, token)=>{
  const res = await _API(`${apiUrl}/admin/trade_orders/?trading_account_id=${trading_account_id}&order_type=${OrderType}`,'get',[],token)
  return res
}