import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminAuthState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminAuthState = {
  token: null,
  isAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",

  initialState,

  reducers: {
    setAdminToken: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    clearAdminAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setAdminToken,
  clearAdminAuth,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;