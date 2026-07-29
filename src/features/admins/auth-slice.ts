import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminAuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminAuthState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    clearAdminAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setAdminToken, clearAdminAuth } = authSlice.actions;
export default authSlice.reducer;
