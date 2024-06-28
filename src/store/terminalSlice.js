import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Login } from "../utils/_APICalls";
import { TerminalLogin } from "../utils/_Terminal";


export const loginTerminalUser = createAsyncThunk('user/loginUser',async(loginData)=>{
    const res = await TerminalLogin(loginData)
    const {data:{message, payload, success}} = res
    return [payload, message, success]
  })

export const logoutTerminalUser = createAsyncThunk('user/logoutUser',async()=>{
    return new Promise((resolve) => setTimeout(() => resolve('Logout Successfully'), 1000))
   })

const terminalSlice = createSlice({
  name: 'user',
  initialState:{
   loading : false,
   user: null, 
   error: null,
   selectedWatchMarket:null,
   selectedWatchMarketHours:[]
  }, 
  reducers:{
    setSelectedWatchMarket:(state,action)=>{
      state.selectedWatchMarket = action.payload
    },
     setSelectedWatchMarketHours:(state,action)=>{
      state.selectedWatchMarketHours = action.payload
    },
    setLogoutUser:(state,action)=>{
      state.user=null
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(loginTerminalUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(loginTerminalUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = action.payload[0], 
      state.error=  null
    })
    .addCase(loginTerminalUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    }).addCase(logoutTerminalUser.pending, (state)=>{
      state.loading = true,
      state.user = null, 
      state.error=  null
    })
    .addCase(logoutTerminalUser.fulfilled, (state, action)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    })
    .addCase(logoutTerminalUser.rejected, (state)=>{
      state.loading = false,
      state.user = null, 
      state.error=  null
    })
    
  }
})

export const {setSelectedWatchMarket,setSelectedWatchMarketHours,setLogoutUser} = terminalSlice.actions

export default terminalSlice.reducer

