import {  createSlice } from "@reduxjs/toolkit";

export const tradeGroupsWithdrawSlice = createSlice({
  name: 'tradeWithdrawGroups',
   initialState : {
  selectedRowsIds: null,
  tradeWithdrawGroupsData: []
},
  reducers: {
    setTradeWithdrawGroupsSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTradeWithdrawGroupsData: (state, action)=>{
      let newData = [...state.tradeWithdrawGroupsData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.tradeWithdrawGroupsData = newData;
    }, 
    tradeWithdrawGroupsData: (state, action) => {
      const idToDelete = action.payload;
      state.tradeWithdrawGroupsData = state.tradeWithdrawGroupsData.filter(item => item.id !== idToDelete);
    }
  },
})

export const {setTradeWithdrawGroupsSelectedIDs, setTradeWithdrawGroupsData, tradeWithdrawGroupsData } = tradeGroupsWithdrawSlice.actions

export default tradeGroupsWithdrawSlice.reducer