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

const storage = createWebStorage("local");

import { api } from "../api/base";
import adminAuthReducer from "../../features/admins/stores/auth-slice";
console.log(storage);
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
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;