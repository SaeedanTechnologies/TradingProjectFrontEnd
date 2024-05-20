import {  createSlice } from "@reduxjs/toolkit";
 
export const tradeOrdersSlice = createSlice({
  name: 'tradeOrders',
   initialState : {
        selectedLiveOrdersRowsIds: null,
        liveOrdersData: [],
        selectedCloseOrdersRowsIds: null,
        closeOrdersData: [],
        selectedPendingOrdersRowsIds:null,
        pendingOrdersData:[],
},
  reducers: {
    setLiveOrdersSelectedIds: (state,action) => {
        state.selectedLiveOrdersRowsIds = action.payload
    },
    setLiveOrdersData: (state, action)=>{
      let newData = [...state.liveOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.liveOrdersData = newData;
    }, 
    deleteLiveOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.liveOrdersData = state.liveOrdersData.filter(order => order.id !== idToDelete);
    },
     setCloseOrdersSelectedIds: (state,action) => {
        state.selectedCloseOrdersRowsIds = action.payload
    },
    setCloseOrdersData: (state, action)=>{
      let newData = [...state.closeOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.closeOrdersData = newData;
    },
    deleteCloseOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.closeOrdersData = state.closeOrdersData.filter(order => order.id !== idToDelete);
    },
     setPendingOrdersSelectedIds: (state,action) => {
        state.selectedPendingOrdersRowsIds = action.payload
    },
    setPendingOrdersData: (state, action)=>{
      debugger
      let newData = [...state.pendingOrdersData];
        action.payload.forEach(newItem => {
          // Check if newItem's ID already exists in array c
          const isDuplicate = newData.some(item => item.id === newItem.id);
          // If not a duplicate, push it to array c
          if (!isDuplicate) {
            newData.push(newItem);
          }
        });
      state.pendingOrdersData =  [...newData];
    },
     deletePendingOrderById: (state, action) => {
      const idToDelete = action.payload;
      state.pendingOrdersData = state.pendingOrdersData.filter(order => order.id !== idToDelete);
    },


  },
})

export const {setLiveOrdersSelectedIds, setLiveOrdersData, deleteLiveOrderById,setCloseOrdersSelectedIds,setCloseOrdersData,deleteCloseOrderById,setPendingOrdersData,setPendingOrdersSelectedIds,deletePendingOrderById } = tradeOrdersSlice.actions

export default tradeOrdersSlice.reducer