import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slices/loadingSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
});

export default store;
