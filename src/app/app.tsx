import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";
import PageError from "@/components/feedback/page-error";
import { persistor } from "@/lib/stores/store";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={PageError}
      onError={(error, info) => {
        console.error("Unhandled application error:", error, info);
      }}
    >
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <AppRouter />
        </AppProvider>
      </PersistGate>
    </ErrorBoundary>
  );
}

export default App;