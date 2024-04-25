import { _API } from "./_API"
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const deleteOrder = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/trade_orders/${id}`, 'delete', [], token)
    return res
}

export const GET_Group_Trade_Order = async (token) => {
    const res = await _API(`${apiUrl}/admin/group_trade_orders`, 'get', [], token)
    return res
}

export const GET_Group_Transaction_Order = async (token) => {
    const res = await _API(`${apiUrl}/admin/group_transaction_orders`, 'get', [], token)
    return res
}

export const Save_Group_Order = async (TransactionOrderGroupData, token) => {
    const res = await _API(`${apiUrl}/admin/group_transaction_orders`, 'post', TransactionOrderGroupData, token)
    return res
}