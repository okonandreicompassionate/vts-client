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
import adminAuthReducer from "../../features/admins/stores/admin-auth-slice";
import visitorAuthReducer from "../../features/visitors/stores/visitor-auth-slice";

const storage = createWebStorage("local");

const adminPersistConfig = {
  key: "adminAuth",
  storage,
};

const visitorPersistConfig = {
  key: "visitorAuth",
  storage,
};

const persistedAdminAuthReducer = persistReducer(
  adminPersistConfig,
  adminAuthReducer,
);

const persistedVisitorAuthReducer = persistReducer(
  visitorPersistConfig,
  visitorAuthReducer,
);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
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
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;