import {  createSlice } from "@reduxjs/toolkit";

export const tradeGroupsSlice = createSlice({
  name: 'tradeGroups',
   initialState : {
  selectedRowsIds: null,
  tradeGroupsData: []
},
  reducers: {
    setTradeGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTradeGroupsData: (state, action)=>{
      let newData = [...state.tradeGroupsData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.tradeGroupsData = newData;
    }, 
    deleteTradeGroupById: (state, action) => {
      const idToDelete = action.payload;
      state.tradeGroupsData = state.tradeGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setTradeGroupsSelectedIDs, setTradeGroupsData, deleteTradeGroupById } = tradeGroupsSlice.actions

export default tradeGroupsSlice.reducer