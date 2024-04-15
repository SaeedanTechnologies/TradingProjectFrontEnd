import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

//Auth
export const Login = async ({email, password})=> {
    const mLogin = await _API(`${apiUrl}/auth/login`,'post',{email, password})
    return mLogin
}

//Brads
export const SaveBrands = async(BrandData, token)=>{
  const res = await _API(`${apiUrl}/admin/brands`,'post',BrandData, token)
  return res 

}

export const UpdateBrand = async (BrandID, BrandData, token) => {
  const queryParams = new URLSearchParams(BrandData).toString();
  const url = `${apiUrl}/admin/brands/${BrandID}?${queryParams}`;
  const res = await _API(url, 'put', null, token);
  return res;
};

export const Brands_List = async(token) =>{
  const mBrands = await _API(`${apiUrl}/admin/brands`,'get',[],token)
   return mBrands
}

export const GetSingleBrand = async(BrandID,token)=>{
  const mBrand = await _API(`${apiUrl}/admin/brands/${BrandID}`,'get',[],token)
  return mBrand
}

export const DeleteBrand = async(BrandID, token)=>{
  const res = await _API(`${apiUrl}/admin/brands/${BrandID}`,'delete',[],token)
  return res

}

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