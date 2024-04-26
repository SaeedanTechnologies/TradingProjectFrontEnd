import {  createSlice } from "@reduxjs/toolkit";
 
export const symbolSettingsSlice = createSlice({
  name: 'symbolSettings',
   initialState : {
  selectedRowsIds: null,
},
  reducers: {
    setSymbolSettingsSelecetdIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
  },
})

export const {setSymbolSettingsSelecetdIDs } = symbolSettingsSlice.actions

export default symbolSettingsSlice.reducer