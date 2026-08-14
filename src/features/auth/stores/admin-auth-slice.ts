import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "Auth",

  initialState,

  reducers: {
    setAdminToken: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setAdminToken,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;