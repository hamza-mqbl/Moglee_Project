import { createReducer } from "@reduxjs/toolkit";
const initialState = {
  isLoading: true,
  loading:true,
};
export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all orders of a shopify
    .addCase("getAllOrderUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("getAllOrderUserSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.success = true;
    })
    .addCase("getAllOrderUserFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("getDispatchBacklogReasonsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getDispatchBacklogReasonsSuccess", (state, action) => {
      state.isLoading = false;
      state.backLogReasons = action.payload;
      state.success = true;
    })
    .addCase("getDispatchBacklogReasonsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
