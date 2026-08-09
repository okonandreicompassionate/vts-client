import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VisitorAuthState {
  visitorId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
}

const initialState: VisitorAuthState = {
  visitorId: null,
  accessToken: null,
  isAuthenticated: false,
  isVerified: false,
};

const visitorAuthSlice = createSlice({
  name: "visitorAuth",

  initialState,

  reducers: {
    setVisitorSession: (
      state,
      action: PayloadAction<{
        visitorId: string;
        accessToken: string;
      }>,
    ) => {
      state.visitorId = action.payload.visitorId;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isVerified = true;
    },

    clearVisitorAuth: (state) => {
      state.visitorId = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isVerified = false;
    },
  },
});

export const {
  setVisitorSession,
  clearVisitorAuth,
} = visitorAuthSlice.actions;

export default visitorAuthSlice.reducer;