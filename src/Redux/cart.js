import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    open: false,
    items: [],
    count: 0,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.count = state.items.length;
    },
    openCart: (state) => {
      state.open = true;
    },
    closeCart: (state) => {
      state.open = false;
    },
  },
});

export const { setCartItems, openCart, closeCart } = cartSlice.actions;

export default cartSlice.reducer;
