import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";
import PageError from "@/components/page-error";
import { useAuthSession } from "@/features/admins/hooks/use-auth-session";
import { persistor } from "@/lib/stores/store";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function AuthSessionManager() {
  useAuthSession();

  return null;
}

function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <AppProvider>
        <ErrorBoundary FallbackComponent={PageError}>
          <AuthSessionManager />
          <AppRouter />
        </ErrorBoundary>
      </AppProvider>
    </PersistGate>
  );
}

export default App;