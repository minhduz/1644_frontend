import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    singedIn: false,
    email: "",
    role: [],
    id: "",
    shippingAddress: {},
  },
  reducers: {
    setUser: (state, action) => {
      const { singedIn, email, role, id, shippingAddress } = action.payload;
      state.singedIn = singedIn;
      state.email = email;
      state.role = role;
      state.id = id;
      state.shippingAddress = shippingAddress;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
