import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
    <main>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </main>
  );
}

export default App;
