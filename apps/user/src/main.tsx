import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/index.css";
import App from "../src/app/app";
import "@fontsource-variable/raleway/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
