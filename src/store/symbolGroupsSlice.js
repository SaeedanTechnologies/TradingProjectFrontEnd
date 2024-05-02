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
      let newData = [...state.symbolGroupsData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.symbolGroupsData = newData;
    }, 
    deleteSymbolGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolGroupsData = state.symbolGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setSymbolGroupsSelectedIDs, setSymbolGroupsData, deleteSymbolGroupById } = symbolGroupsSlice.actions

export default symbolGroupsSlice.reducer