import { StyleProvider } from "@ant-design/cssinjs";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useMemo } from "react";
import { getThemeConfig } from "./theme";
import { PopupProvider } from "../lib/contexts/popup/popup-provider";
import { msalConfig } from "../lib/api/msal";
import { store } from "../lib/stores/store";
import { ThemeProvider } from "../lib/contexts/theme/theme-provider";
import { useTheme } from "../hooks/use-theme";

const msalInstance = new PublicClientApplication(msalConfig);

function AppProviderContent({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getThemeConfig(isDark), [isDark]);

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

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MsalProvider instance={msalInstance}>
        <AppProviderContent>{children}</AppProviderContent>
      </MsalProvider>
    </ThemeProvider>
  );
}
