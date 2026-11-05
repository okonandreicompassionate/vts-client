import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "@/lib/api/api";

import authReducer from "@/features/auth/stores/admin-auth-slice";
import visitorAuthReducer from "@/features/visitor-portal/stores/visitor-auth-slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,

    adminAuth: authReducer,
    visitorAuth: visitorAuthReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
