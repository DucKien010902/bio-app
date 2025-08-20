import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import openMenuReducer from './slices/openMenuSlice';
const store = configureStore({
  reducer: {
    chat: chatReducer,
    openMenu: openMenuReducer,
  },
});

export default store;
