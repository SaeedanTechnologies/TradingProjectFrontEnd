import {  createSlice } from "@reduxjs/toolkit";
 
export const symbolSettingsSlice = createSlice({
  name: 'symbolSettings',
   initialState : {
  selectedRowsIds: null,
  symbolSettingsData: []
},
  reducers: {
    setSymbolSettingsSelecetdIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setSymbolSettingsData: (state, action)=>{
      let newData = [...state.symbolSettingsData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.symbolSettingsData = newData;
    }, 
    updateSymbolSettings: (state, action) => {
      const updatedData = action.payload;
      const index = state.symbolSettingsData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.symbolSettingsData[index] = {
          ...state.symbolSettingsData[index],
          ...updatedData,
        };
      }
    },
    deleteSymbolSettingsById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolSettingsData = state.symbolSettingsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setSymbolSettingsSelecetdIDs, setSymbolSettingsData, deleteSymbolSettingsById, updateSymbolSettings } = symbolSettingsSlice.actions

export default symbolSettingsSlice.reducer