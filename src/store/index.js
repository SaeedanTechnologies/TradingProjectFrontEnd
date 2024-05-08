import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./UserSlice";
import trade from "./TradeSlice";
import symbolSettings from "./symbolSettingsSlice";
import symbolGroups from "./symbolGroupsSlice"
import transactionOrders from './transactionOrdersSlice'
import storage from 'redux-persist/lib/storage'
import group from './TradingGroupData'
import brands from './BrandsSlice'
import tradeGroups from "./tradeGroupsSlice";
import tradingAccountGroup from "./tradingAccountGroupSlice";

const createRootReducer = asyncReducers => {
  const appReducer = combineReducers({
      user,
      group,
      trade,
      symbolSettings,
      symbolGroups,
      brands,
      transactionOrders,
      tradeGroups,
      tradingAccountGroup,
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