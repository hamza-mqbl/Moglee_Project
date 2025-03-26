import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { orderReducer } from "./reducers/order";
const Store = configureStore({
  reducer: {
    user: userReducer,
    orders: orderReducer,
  },
});

export default Store;
