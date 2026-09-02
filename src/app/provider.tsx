import { StyleProvider } from "@ant-design/cssinjs";
import { ApolloProvider } from "@apollo/client/react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useMemo } from "react";
import { getThemeConfig } from "./theme";
import { PopupProvider } from "../features/popup/components/popup-provider";
import { msalConfig } from "../features/auth/api/msal-client";
import { apolloClient } from "../lib/graphql/apollo-client";
import { store } from "../lib/stores/store";
import { ThemeProvider } from "../features/theme/components/theme-provider";
import { useTheme } from "../features/theme/hooks/use-theme";

const msalInstance = new PublicClientApplication(msalConfig);

function AppProviderContent({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getThemeConfig(isDark), [isDark]);

  return (
    <StyleProvider layer>
      <ConfigProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>
            <PopupProvider>{children}</PopupProvider>
          </Provider>
        </ApolloProvider>
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
