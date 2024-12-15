import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    incrementCartCount: (state, action) => {
          state.cartCount += action.payload;
    },
    clearCartCount: (state) => {
      state.cartCount = 0;
    },
  },
});

export const { incrementCartCount, clearCartCount } = cartSlice.actions;
export default cartSlice.reducer;
