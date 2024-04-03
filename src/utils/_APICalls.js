import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const Brands_List = async() =>{
  const mBrands = await _API(`${apiUrl}/admin/brands`,'get')
   return mBrands
}

