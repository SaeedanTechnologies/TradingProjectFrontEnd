import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./UserSlice";
import trade from "./TradeSlice";
import symbolSettings from "./symbolSettingsSlice";
import storage from 'redux-persist/lib/storage'
import group from './TradingGroupData'
import brands from './BrandsSlice'

const createRootReducer = asyncReducers => {
  const appReducer = combineReducers({
      user,
      group,
      trade,
      symbolSettings,
      brands,
      ...asyncReducers
  });
  
  return (state, action) => {
      if (action.type === 'user/userLoggedOut') {
          state = undefined;
          storage.removeItem('persist:root')
      }
      return appReducer(state, action);
  }

};

// const store = configureStore({
//     reducer:{
//       user: userReducer
//     }
// })

export default createRootReducer