import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  orgSlug: string;
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setAuthenticatedUser: (
      state,
      action: PayloadAction<AdminUser>,
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setAuthenticatedUser,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;