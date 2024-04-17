import {  createSlice } from "@reduxjs/toolkit";
 
export const tradingSlice = createSlice({
  name: 'trade',
   initialState : {
  trading_account_id: 0,
},
  reducers: {
    setAccountID: (state,action) => {
      state.trading_account_id = action.payload
    },
  },
})

export const {setAccountID } = tradingSlice.actions

export default tradingSlice.reducer