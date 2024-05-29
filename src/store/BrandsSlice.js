import {  createSlice } from "@reduxjs/toolkit";
 
export const brandsSlice = createSlice({
  name: 'brand',
   initialState : {
   user: {
    user_id:-1,permissions: []
   },
   selectedRowsIds: null,
   brandData: []
},
  reducers: {
    setBrandUser: (state,action) => {
      state.user = action.payload
    },
    setBrandSelectedIDs: (state,action) => {
      state.selectedRowsIds = action.payload
  },
  setBrandData: (state, action)=>{
    state.brandData = action.payload;
  }, 
  updateBrandsData: (state, action) => {
    const updatedData = action.payload;
    updatedData.forEach(updatedData => {
    const index = state.brandData.findIndex(item => item.id === updatedData.id);
    if (index !== -1) {
      state.brandData[index] = {
        ...state.brandData[index],
        ...updatedData,
      };
    }
  });
  },
  deleteBrandById: (state, action) => {
    const idToDelete = action.payload;
    state.brandData = state.brandData.filter(item => item.id !== idToDelete);
  }
  },
})

export const { setBrandUser, setBrandSelectedIDs, setBrandData, updateBrandsData, deleteBrandById } = brandsSlice.actions

export default brandsSlice.reducer