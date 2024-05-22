import {  createSlice } from "@reduxjs/toolkit";

export const symbolGroupsSlice = createSlice({
  name: 'symbolGroups',
   initialState : {
  selectedRowsIds: null,
  symbolGroupsData: []
},
  reducers: {
    setSymbolGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setSymbolGroupsData: (state, action)=>{
    
      state.symbolGroupsData = action.payload.sort((a, b) => a.id - b.id);
    }, 
    updateSymbolGroups: (state, action) => {
      const updatedData = action.payload;
      const index = state.symbolGroupsData.findIndex(item => item.id === updatedData.id);
      if (index !== -1) {
        state.symbolGroupsData[index] = {
          ...state.symbolGroupsData[index],
          ...updatedData,
        };
      }
    },
    deleteSymbolGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolGroupsData = state.symbolGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setSymbolGroupsSelectedIDs, setSymbolGroupsData, deleteSymbolGroupById, updateSymbolGroups } = symbolGroupsSlice.actions

export default symbolGroupsSlice.reducer