import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "@/types/user-role";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phoneNumber: string | null;
  orgSlug: string;
  avatar?: string;
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