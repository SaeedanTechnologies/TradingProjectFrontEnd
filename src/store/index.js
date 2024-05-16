import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./UserSlice";
import trade from "./TradeSlice";
import symbolSettings from "./symbolSettingsSlice";
import symbolGroups from "./symbolGroupsSlice"
import transactionOrders from './transactionOrdersSlice'
import tradeOrders  from './TradeOrders'
import storage from 'redux-persist/lib/storage'
import group from './TradingGroupData'
import brands from './BrandsSlice'
import tradeGroups from "./tradeGroupsSlice";
import tradingAccountGroup from "./tradingAccountGroupSlice";
import tradeWithdrawGroups from "./tradeGroupsWithdrawSlice";
import liveOrder from "./LiveOrderSlice";

const createRootReducer = asyncReducers => {
  const appReducer = combineReducers({
      user,
      group,
      trade,
      symbolSettings,
      symbolGroups,
      brands,
      liveOrder,
      transactionOrders,
      tradeOrders,
      tradeGroups,
      tradingAccountGroup,
      tradeWithdrawGroups,
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