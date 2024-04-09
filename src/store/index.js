import { configureStore, combineReducers } from "@reduxjs/toolkit";
import user from "./UserSlice";
import storage from 'redux-persist/lib/storage'

const createRootReducer = asyncReducers => {
  const appReducer = combineReducers({
      user,
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