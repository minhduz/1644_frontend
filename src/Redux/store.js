import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import cartReducer from "./cart";

export default configureStore({
  reducer: { user: userReducer, cart: cartReducer },
});
