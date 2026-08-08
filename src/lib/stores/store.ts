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
import adminAuthReducer from "../../features/admins/stores/auth-slice";

const storage = createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["adminAuth"],
};

const persistedReducer = persistReducer(
  persistConfig,
  adminAuthReducer,
);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [visitorApi.reducerPath]: visitorApi.reducer,
    adminAuth: persistedReducer,
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
    })
      .concat(api.middleware)
      .concat(visitorApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;