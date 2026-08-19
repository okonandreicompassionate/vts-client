import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { adminApi } from "@/lib/api/admin/admin-api";
import { visitorApi } from "@/lib/api/visitor/visitor-api";
import { publicApi } from "@/lib/api/public/public-api";

import authReducer from "@/features/auth/stores/admin-auth-slice";
import visitorAuthReducer from "@/features/auth/stores/visitor-auth-slice";

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [adminApi.reducerPath]: adminApi.reducer,
    [visitorApi.reducerPath]: visitorApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,

    // Client-side auth/user state.
    // Authentication itself is handled by the HttpOnly cookie.
    adminAuth: authReducer,
    visitorAuth: visitorAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      visitorApi.middleware,
      publicApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
