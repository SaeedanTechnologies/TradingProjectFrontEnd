import { _API } from "./_API"
const apiUrl = import.meta.env.VITE_TRADING_BASE_URL;

export const deleteOrder = async (id, token) => {
    const res = await _API(`${apiUrl}/admin/trade_orders/${id}`, 'delete', [], token)
    return res
}