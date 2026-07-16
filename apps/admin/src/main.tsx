import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "@fontsource-variable/raleway/index.css";
import AppConfigProvider from "./components/AppConfigProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer>
      <AppConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
