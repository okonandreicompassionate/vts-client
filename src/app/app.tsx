import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";

import PageError from "@/components/page-error";
import { persistor } from "@/lib/stores/store";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
    <ErrorBoundary FallbackComponent={PageError}>
      <PersistGate loading={null} persistor={persistor}>
        <main>
          <AppProvider>
            <AppRouter />
          </AppProvider>
        </main>
      </PersistGate>
    </ErrorBoundary>
  );
}

export default App;