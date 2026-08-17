import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { adminApi } from "@/lib/api/admin/admin-api";
import { visitorApi } from "@/lib/api/visitor/visitor-api";
import { publicApi } from "@/lib/api/public/public-api";
import authReducer from "@/features/auth/stores/admin-auth-slice";
import visitorAuthReducer from "@/features/auth/stores/visitor-auth-slice";

const storage = createWebStorage("local");

const adminAuthPersistConfig = {
  key: "adminAuth",
  storage,
};

const visitorAuthPersistConfig = {
  key: "visitorAuth",
  storage,
};

const persistedAdminAuthReducer = persistReducer(
  adminAuthPersistConfig,
  authReducer,
);

const persistedVisitorAuthReducer = persistReducer(
  visitorAuthPersistConfig,
  visitorAuthReducer,
);

export const store = configureStore({
  reducer: {
    // RTK Query APIs
    [adminApi.reducerPath]: adminApi.reducer,
    [visitorApi.reducerPath]: visitorApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,

    // Authentication
    adminAuth: persistedAdminAuthReducer,
    visitorAuth: persistedVisitorAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }).concat(
      adminApi.middleware,
      visitorApi.middleware,
      publicApi.middleware,
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;