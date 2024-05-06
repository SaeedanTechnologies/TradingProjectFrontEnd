import {  createSlice } from "@reduxjs/toolkit";
 
export const transactionOrdersSlice = createSlice({
  name: 'transactionOrders',
   initialState : {
  selectedRowsIds: null,
  transactionOrdersData: []
},
  reducers: {
    setTransactionsOrdersSelectedIDs: (state,action) => {
        state.selectedRowsIds = action.payload
    },
    setTransactionOrdersData: (state, action)=>{
      let newData = [...state.transactionOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.transactionOrdersData = newData;
    }, 
    deleteTransactionOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.symbolSettingsData = state.transactionOrdersData.filter(order => order.id !== idToDelete);
    }
  },
})

export const {setTransactionsOrdersSelectedIDs, setTransactionOrdersData, deleteTransactionOrderById } = transactionOrdersSlice.actions

export default transactionOrdersSlice.reducer