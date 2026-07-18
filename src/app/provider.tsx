import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";
import { PopupProvider } from "../lib/contexts/PopupProvider";

const theme = {
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
};

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={theme}>
        <PopupProvider>{children}</PopupProvider>
      </ConfigProvider>
    </StyleProvider>
  );
}
