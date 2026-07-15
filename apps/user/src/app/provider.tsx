import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import type { ReactNode } from "react";

const theme = {
  token: {
    colorPrimary: "#0ea5e9",
    colorInfo: "#0ea5e9",
    colorPrimaryHover: "#0284c7",
    colorPrimaryActive: "#0369a1",
    borderRadius: 12,
    fontFamily: "'Raleway Variable', sans-serif",
  },
};

export function AppProvider({children}: {children: ReactNode}){
    return (
        <StyleProvider layer>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </StyleProvider>
    )
}
