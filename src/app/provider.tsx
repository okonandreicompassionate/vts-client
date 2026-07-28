import { StyleProvider } from "@ant-design/cssinjs";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { theme } from "./theme";
import { PopupProvider } from "../lib/contexts/PopupProvider";
import { msalConfig } from "../lib/api/msal";
import { store } from "../stores/store";



const msalInstance = new PublicClientApplication(msalConfig);

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <StyleProvider layer>
        <ConfigProvider theme={theme}>
          <Provider store={store}>
            <PopupProvider>{children}</PopupProvider>
          </Provider>
        </ConfigProvider>
      </StyleProvider>
    </MsalProvider>
  );
}
