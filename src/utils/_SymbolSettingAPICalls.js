import { _API } from "./_API"
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;
export const SymbolSettingPost = async (SymbolSetting, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting`, 'post', SymbolSetting, token)
    return res

}

export const Symbol_Group_List = async (token) => {
    const res = await _API(`${apiUrl}/admin/symbel_group`, 'get', [], token)
    return res
}