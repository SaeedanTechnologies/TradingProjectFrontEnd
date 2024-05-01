import {  createSlice } from "@reduxjs/toolkit";
 
export const brandsSlice = createSlice({
  name: 'brand',
   initialState : {
   user: {
    user_id:-1,permissions: []
   },
},
  reducers: {
    setBrandUser: (state,action) => {
      state.user = action.payload
    },
  },
})

export const { setBrandUser } = brandsSlice.actions

export default brandsSlice.reducer