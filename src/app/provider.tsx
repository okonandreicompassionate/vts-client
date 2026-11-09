import { StyleProvider } from "@ant-design/cssinjs";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useMemo } from "react";
import { getThemeConfig } from "./theme";
import { msalConfig } from "../features/auth/api/msal-client";
import { store } from "../lib/stores/store";
import { ThemeProvider } from "@/lib/contexts/theme/theme-provider";
import { useTheme } from "@/lib/contexts/theme/use-theme";

const msalInstance = new PublicClientApplication(msalConfig);

function AppProviderContent({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getThemeConfig(isDark), [isDark]);

  return (
    <StyleProvider layer>
      {/* scrollToFirstError: a field that fails off-screen (e.g. in a scrolled modal) is brought into view. */}
      <ConfigProvider
        theme={theme}
        componentSize="small"
        form={{ requiredMark: false, scrollToFirstError: true }}
      >
        <Provider store={store}>
          {children}
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
