import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/stores/store";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </PersistGate>
  );
}

export default App;
