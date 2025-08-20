import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openChat: false,
  shopInfo: null, // bạn có thể lưu luôn shopInfo ở đây nếu cần
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChatPanel: (state, action) => {
      state.openChat = true;
      state.shopInfo = action.payload ?? null;
    },
    closeChatPanel: (state) => {
      state.openChat = false;
      state.shopInfo = null;
    },
  },
});

export const { openChatPanel, closeChatPanel } = chatSlice.actions;
export default chatSlice.reducer;
