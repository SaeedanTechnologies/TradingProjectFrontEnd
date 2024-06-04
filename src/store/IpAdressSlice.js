import {  createSlice } from "@reduxjs/toolkit";
 
export const ipAddress = createSlice({
  name: 'ip_address',
   initialState : {
        selectedIpRowsIds: null,
        ipAddressData: [],
        
//
},
  reducers: {
    setIPAddressSelectedIds: (state,action) => {
        state.selectedIpRowsIds = action.payload
    },
    setIpAddressData: (state, action)=>{
      state.ipAddressData = action.payload
    }, 
  },
})

export const {setIPAddressSelectedIds, setIpAddressData  } = ipAddress.actions

export default ipAddress.reducer


