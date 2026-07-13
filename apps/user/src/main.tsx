import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyleProvider } from "@ant-design/cssinjs";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";
import App from "./App.tsx";
import "@fontsource-variable/raleway/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0ea5e9",
            colorInfo: "#0ea5e9",
            colorPrimaryHover: "#0284c7",
            colorPrimaryActive: "#0369a1",
            borderRadius: 12,
            fontFamily: "'Raleway Variable', sans-serif",
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
