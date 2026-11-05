import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VisitorAuthState {
  visitorId: string | null;
  sessionVisitId: string | null;

  verifiedName: string | null;
  verifiedEmail: string | null;
  verifiedPhoneNumber: string | null;

  isAuthenticated: boolean;
  isVerified: boolean;
}

const initialState: VisitorAuthState = {
  visitorId: null,
  sessionVisitId: null,

  verifiedName: null,
  verifiedEmail: null,
  verifiedPhoneNumber: null,

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
        fullName?: string | null;
        email?: string | null;
        phoneNumber?: string | null;
        emailVerified?: boolean;
        sessionVisitId?: string;
      }>,
    ) => {
      state.visitorId = action.payload.visitorId;
      state.sessionVisitId = action.payload.sessionVisitId ?? null;

      state.verifiedName = action.payload.fullName ?? null;

      state.verifiedEmail = action.payload.email ?? null;

      state.verifiedPhoneNumber = action.payload.phoneNumber ?? null;

      state.isAuthenticated = true;
      state.isVerified = action.payload.emailVerified ?? true;
    },

    setVisitorVerified: (
      state,
      action: PayloadAction<{
        email: string;
      }>,
    ) => {
      state.visitorId = null;
      state.sessionVisitId = null;

      state.verifiedName = null;
      state.verifiedEmail = action.payload.email;
      state.verifiedPhoneNumber = null;

      state.isAuthenticated = false;
      state.isVerified = true;
    },

    clearVisitorAuth: (state) => {
      state.visitorId = null;
      state.sessionVisitId = null;

      state.verifiedName = null;
      state.verifiedEmail = null;
      state.verifiedPhoneNumber = null;

      state.isAuthenticated = false;
      state.isVerified = false;
    },
  },
});

export const { setVisitorSession, setVisitorVerified, clearVisitorAuth } = visitorAuthSlice.actions;

export default visitorAuthSlice.reducer;
