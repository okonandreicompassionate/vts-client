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

import { api } from "../api/base";
import { visitorApi } from "@/features/visitors/api/visit-base";

import adminAuthReducer from "@/features/admins/stores/admin-auth-slice";
import visitorAuthReducer from "@/features/visitors/stores/visitor-auth-slice";

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
  adminAuthReducer,
);

const persistedVisitorAuthReducer = persistReducer(
  visitorAuthPersistConfig,
  visitorAuthReducer,
);

export const store = configureStore({
  reducer: {
    // Admin/general RTK Query
    [api.reducerPath]: api.reducer,

    // Visitor RTK Query
    [visitorApi.reducerPath]: visitorApi.reducer,

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
      api.middleware,
      visitorApi.middleware,
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;