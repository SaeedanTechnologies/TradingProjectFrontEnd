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

export const Feed_Data_List = async (token) => {
    const res = await _API(`${apiUrl}/admin/data_feed`, 'get', [], token)
    return res
}


export const All_Setting_Data = async (token, page=1) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting?page=${page}`, 'get', [], token)
    return res
}

export const DeleteSymbolSetting = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting/${id}`, 'delete', [], token)
    return res
}
export const SelectSymbolSettingsWRTID = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/symbel_setting/${id}`, 'get', [], token)
    return res
}

export const UpdateSymbolSettings = async (SymbolSettingsID, SymbolSettingsData, token) => {
    const queryParams = new URLSearchParams(SymbolSettingsData).toString();
    const url = `${apiUrl}/admin/symbel_setting/${SymbolSettingsID}?${queryParams}`;
    const res = await _API(url, 'put', null, token);
    return res
}

export const Trading_Active_Group = async (token, status,brandId) => {

    let url =`${apiUrl}/admin/trading_accounts?status=${status}`
    if(brandId){
        url= `${apiUrl}/admin/trading_accounts?status=${status}&brand_id=${brandId}`
    }

    const res = await _API(url, 'get', [], token)

    return res
}

export const Trading_Margin_Calls = async (token, status,brandId) => {
    let url =`${apiUrl}/admin/trading_accounts?status=${status}`
    if(brandId){
        url= `${apiUrl}/admin/trading_accounts?status=${status}&brand_id=${brandId}`
    }

    const res = await _API(url, 'get', [], token)
    return res
}

export const Trading_Transaction_Order = async (token,brandId) => {
   let url = `${apiUrl}/admin/transaction_order`
    if(brandId){
     url = `${apiUrl}/admin/transaction_order?brand_id=${brandId}`
    }
    const res = await _API(url, 'get', [], token)
    return res
}