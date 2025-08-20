import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  IsOpenMenu: false,
};

const openMenuSlice = createSlice({
  name: 'openMenu',
  initialState,
  reducers: {
    openMenuBio: (state) => {
      state.IsOpenMenu = true;
    },
    closeMenuBio: (state) => {
      state.IsOpenMenu = false;
    },
  },
});

export const { openMenuBio, closeMenuBio } = openMenuSlice.actions;
export default openMenuSlice.reducer;
