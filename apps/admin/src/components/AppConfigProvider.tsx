import type { ReactNode } from "react";
import { ConfigProvider } from "antd";

type AppConfigProviderProps = {
  children: ReactNode;
};

export default function AppConfigProvider({
  children,
}: AppConfigProviderProps) {
  return (
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
        components: {
          Input: {
            borderRadius: 0,
          },
          Form: {
            labelFontSize: 13,
            verticalLabelPadding: "0 0 4px",
            itemMarginBottom: 16,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
