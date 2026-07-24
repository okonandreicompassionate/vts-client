import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../stores/store";            // ← now from stores
import { PopupProvider } from "../lib/contexts/PopupProvider";
import { theme } from "./theme";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          <PopupProvider>{children}</PopupProvider>
        </Provider>
      </ConfigProvider>
    </StyleProvider>
  );
}