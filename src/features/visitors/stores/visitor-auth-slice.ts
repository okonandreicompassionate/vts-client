import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface VisitorAuthState {
  visitorId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
}

interface StoredVisitorSession {
  visitorId: string;
  accessToken: string;
}

const getStoredVisitorSession = (): StoredVisitorSession | null => {
  try {
    const storedSession = localStorage.getItem("visitorSession");

    if (!storedSession) {
      return null;
    }

    return JSON.parse(storedSession) as StoredVisitorSession;
  } catch {
    localStorage.removeItem("visitorSession");
    return null;
  }
};

const storedSession = getStoredVisitorSession();

const initialState: VisitorAuthState = {
  visitorId: storedSession?.visitorId ?? null,
  accessToken: storedSession?.accessToken ?? null,
  isAuthenticated: !!storedSession?.accessToken,
  isVerified: !!storedSession?.accessToken,
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
      const { visitorId, accessToken } = action.payload;

      state.visitorId = visitorId;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isVerified = true;

      localStorage.setItem(
        "visitorSession",
        JSON.stringify({
          visitorId,
          accessToken,
        }),
      );
    },

    clearVisitorAuth: (state) => {
      state.visitorId = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isVerified = false;

      localStorage.removeItem("visitorSession");
    },
  },
});

export const {
  setVisitorSession,
  clearVisitorAuth,
} = visitorAuthSlice.actions;

export default visitorAuthSlice.reducer;