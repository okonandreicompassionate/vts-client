import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";
import PageError from "@/components/page-error";
import { persistor } from "@/lib/stores/store";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <AppProvider>
        <ErrorBoundary FallbackComponent={PageError}>
          <AppRouter />
        </ErrorBoundary>
      </AppProvider>
    </PersistGate>
  );
}

export default App;