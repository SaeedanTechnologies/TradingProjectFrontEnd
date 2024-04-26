import { _API } from "./_API";

const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const GetBrandsList   = async (token) => {
  const res = await _API(`${apiUrl}/admin/getAllBrandList`, 'get', [], token)
  return res
}