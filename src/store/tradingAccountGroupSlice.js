import { createSlice } from "@reduxjs/toolkit";

export const tradingAccountGroup = createSlice({
    name: 'tradingAccountGroup',
    initialState: {
        tradingAccountGroupData: null,
    },
    reducers: {
        setTradingAccountGroupData: (state, action) => {
            state.tradingAccountGroupData = action.payload
        },
    },
})

export const { setTradingAccountGroupData } = tradingAccountGroup.actions

export default tradingAccountGroup.reducer