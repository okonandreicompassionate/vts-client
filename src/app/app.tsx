import { PopupProvider } from "../features/admin/contexts/PopupProvider";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";

function App() {
  return (
   <PopupProvider>
     <main>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </main>
   </PopupProvider>
  );
}

export default App;
