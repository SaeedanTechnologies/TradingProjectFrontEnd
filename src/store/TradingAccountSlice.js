import {  createSlice } from "@reduxjs/toolkit";
 
export const TradingAccountListSlice = createSlice({
  name: 'tradingAccountList',
  initialState : {
  selectedLiveOrdersRowsIds: null,
  LiveOrdersData: [],
  selectedCloseOrdersRowsIds: null,
  CloseOrdersData: [],
  selectedPendingOrdersRowsIds:null,
  PendingOrdersData:[],
  selectedTransactionOrdersRowsIds:null,
  TransactionOrdersData:[]


},
  reducers: {
   
     setLiveOrdersSelectedIds: (state,action) => {
        state.selectedLiveOrdersRowsIds = action.payload
    },
    setLiveOrdersData: (state, action)=>{
    //   debugger
      let newData = [...state.LiveOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.LiveOrdersData =  [...newData];
    },
     deleteLiveOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.LiveOrdersData = state.LiveOrdersData.filter(order => order.id !== idToDelete);
    },
     setCloseOrdersSelectedIds: (state,action) => {
        state.selectedCloseOrdersRowsIds = action.payload
    },
    setCloseOrdersData: (state, action)=>{
    //   debugger
      let newData = [...state.CloseOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.CloseOrdersData =  [...newData];
    },
     deleteCloseOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.CloseOrdersData = state.CloseOrdersData.filter(order => order.id !== idToDelete);
    },
    setPendingOrdersSelectedIds: (state,action) => {
        state.selectedPendingOrdersRowsIds = action.payload
    },
    setPendingOrdersData: (state, action)=>{
    //   debugger
      let newData = [...state.PendingOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.PendingOrdersData =  [...newData];
    },
     deletePendingOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.PendingOrdersData = state.PendingOrdersData.filter(order => order.id !== idToDelete);
    },
     setTransactionsOrdersSelectedIDs: (state,action) => {
        state.selectedTransactionOrdersRowsIds = action.payload
    },
    setTransactionOrdersData: (state, action)=>{
      // debugger
      let newData = [...state.TransactionOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.TransactionOrdersData = newData;
    }, 
    deleteTransactionOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.TransactionOrdersData = state.TransactionOrdersData.filter(order => order.id !== idToDelete);
    }
  },
})

export const { setLiveOrdersSelectedIds,setLiveOrdersData,deleteLiveOrderById,setCloseOrdersSelectedIds,setCloseOrdersData,deleteCloseOrderById,setPendingOrdersSelectedIds,setPendingOrdersData,deletePendingOrderById, setTransactionsOrdersSelectedIDs,setTransactionOrdersData,deleteTransactionOrderById} = TradingAccountListSlice.actions

export default TradingAccountListSlice.reducer

