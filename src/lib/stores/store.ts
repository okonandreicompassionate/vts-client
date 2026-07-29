import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../api/base";
import adminAuthReducer from "../../features/admins/auth-slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
