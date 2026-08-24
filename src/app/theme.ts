import { theme as antdTheme } from "antd";

const globalFontSize = 12;
const globalFormFieldHeight = 40;

const globalTypographyTokens = {
  fontSize: globalFontSize,
  fontSizeSM: globalFontSize,
  fontSizeLG: globalFontSize,
  fontSizeXL: globalFontSize,
  fontSizeHeading1: globalFontSize,
  fontSizeHeading2: globalFontSize,
  fontSizeHeading3: globalFontSize,
  fontSizeHeading4: globalFontSize,
  fontSizeHeading5: globalFontSize,
};

const globalFormFieldHeightTokens = {
  controlHeight: globalFormFieldHeight,
  controlHeightSM: globalFormFieldHeight,
  controlHeightLG: globalFormFieldHeight,
};

const globalButtonTokens = {
  paddingInline: 10,
  paddingInlineSM: 8,
  paddingInlineLG: 10,
  paddingBlock: 0,
  paddingBlockSM: 0,
  paddingBlockLG: 0,
};

export const getThemeConfig = (isDark: boolean) => {
  const lightTheme = {
    token: {
      ...globalTypographyTokens,
      ...globalFormFieldHeightTokens,
      colorPrimary: "#0ea5e9",
      colorInfo: "#0ea5e9",
      colorPrimaryHover: "#0284c7",
      colorPrimaryActive: "#0369a1",
      borderRadius: 12,
      fontFamily: "'Raleway Variable', sans-serif",
      colorBgBase: "#ffffff",
      colorTextBase: "#1f2937",
      colorBorder: "#e5e7eb",
      colorBgContainer: "#f9fafb",
      colorBgElevated: "#ffffff",
      colorBgLayout: "#ffffff",
      colorBgBlur: "#ffffffaa",
      colorBgMask: "rgba(0, 0, 0, 0.45)",
      colorBgSpotlight: "rgba(0, 0, 0, 0.85)",
    },

    components: {
      Input: {
        ...globalFormFieldHeightTokens,
        borderRadius: 0,
        controlBg: "#ffffff",
        colorText: "#1f2937",
        colorTextPlaceholder: "#9ca3af",
        colorBorder: "#d1d5db",
        colorBgContainerDisabled: "#f3f4f6",
        colorTextDisabled: "#9ca3af",
        colorBgContainer: "#ffffff",
      },

      Form: {
        labelFontSize: globalFontSize,
        verticalLabelPadding: "0 0 4px",
        itemMarginBottom: 10,
        labelColor: "#374151",
      },

      Select: {
        ...globalFormFieldHeightTokens,
        controlBg: "#ffffff",
        colorText: "#1f2937",
        colorTextPlaceholder: "#9ca3af",
        colorBorder: "#d1d5db",
        colorBgContainer: "#ffffff",
      },

      TextArea: {
        controlBg: "#ffffff",
        colorText: "#1f2937",
        colorTextPlaceholder: "#9ca3af",
        colorBorder: "#d1d5db",
        colorBgContainer: "#ffffff",
      },

      Button: {
        ...globalFormFieldHeightTokens,
        ...globalButtonTokens,

        colorBgBase: "#f3f4f6",

        defaultBg: "#ffffff",
        defaultColor: "#1f2937",
        defaultBorderColor: "#d1d5db",
        colorBgTextHover: "transparent",
        colorBgTextActive: "transparent",
        colorBgText: "transparent",
        defaultBgDisabled: "transparent",
        defaultHoverBg: "#f9fafb",
        defaultHoverColor: "#111827",
        defaultHoverBorderColor: "#9ca3af",
      },

      Card: {
        colorBgContainer: "#ffffff",
        colorBorderSecondary: "#e5e7eb",
      },

      Modal: {
        contentBg: "#ffffff",
        headerBg: "#ffffff",
        titleColor: "#1f2937",
      },

      Checkbox: {
        colorBgContainer: "#ffffff",
        colorBorder: "#d1d5db",
      },

      Table: {
        headerBg: "#f9fafb",
        headerColor: "#374151",
        colorBgContainer: "#ffffff",
        rowHoverBg: "#f9fafb",
        borderColor: "#e5e7eb",
      },

      Layout: {
        colorBgHeader: "#ffffff",
        colorBgBody: "#ffffff",
        colorBgTrigger: "#f3f4f6",
        bodyBg: "#ffffff",
        headerBg: "#ffffff",
        headerHeight: 64,
        headerPadding: "0 24px",
        headerColor: "#1f2937",
        footerBg: "#f9fafb",
        footerPadding: "24px 50px",
      },
    },
  };

  const darkTheme = {
    algorithm: antdTheme.darkAlgorithm,

    token: {
      ...globalTypographyTokens,
      ...globalFormFieldHeightTokens,
      colorPrimary: "#0ea5e9",
      colorInfo: "#0ea5e9",
      colorPrimaryHover: "#0284c7",
      colorPrimaryActive: "#0369a1",
      borderRadius: 12,
      fontFamily: "'Raleway Variable', sans-serif",
      colorBgBase: "#0f172a",
      colorTextBase: "#e2e8f0",
      colorBorder: "#334155",
      colorBgContainer: "#1e293b",
      colorBgElevated: "#1e293b",
      colorBgLayout: "#0f172a",
      colorBgBlur: "#0f172aaa",
    },

    components: {
      Input: {
        ...globalFormFieldHeightTokens,
        borderRadius: 0,
        controlBg: "#1e293b",
        colorText: "#e2e8f0",
        colorTextPlaceholder: "#78829e",
        colorBorder: "#334155",
        colorBgContainerDisabled: "#0f172a",
        colorTextDisabled: "#64748b",
      },

      Form: {
        labelFontSize: globalFontSize,
        verticalLabelPadding: "0 0 4px",
        itemMarginBottom: 16,
        labelColor: "#cbd5e1",
      },

      Select: {
        ...globalFormFieldHeightTokens,
        controlBg: "#1e293b",
        colorText: "#e2e8f0",
        colorTextPlaceholder: "#78829e",
        colorBorder: "#334155",
      },

      TextArea: {
        controlBg: "#1e293b",
        colorText: "#e2e8f0",
        colorTextPlaceholder: "#78829e",
        colorBorder: "#334155",
      },

      Button: {
        ...globalFormFieldHeightTokens,
        ...globalButtonTokens,

        colorBgBase: "#1e293b",

        defaultBg: "#1e293b",
        defaultColor: "#e2e8f0",
        defaultBorderColor: "#475569",

        defaultHoverBg: "#334155",
        defaultHoverColor: "#f8fafc",
        defaultHoverBorderColor: "#64748b",

        defaultActiveBg: "#334155",
        defaultActiveColor: "#f8fafc",
        defaultActiveBorderColor: "#64748b",

        primaryBg: "#0ea5e9",
        primaryColor: "#f8fafc",
        primaryBorderColor: "#0ea5e9",

        primaryHoverBg: "#0284c7",
        primaryHoverColor: "#f8fafc",
        primaryHoverBorderColor: "#0284c7",

        primaryActiveBg: "#0369a1",
        primaryActiveColor: "#f8fafc",
        primaryActiveBorderColor: "#0369a1",

        primaryShadow: "none",
      },

      Card: {
        colorBgContainer: "#1e293b",
        colorBorderSecondary: "#334155",
      },

      Modal: {
        contentBg: "#1e293b",
        headerBg: "#1e293b",
        titleColor: "#e2e8f0",
      },

      Checkbox: {
        colorBgContainer: "#1e293b",
        colorBorder: "#475569",
      },

      Table: {
        headerBg: "#0f172a",
        headerColor: "#cbd5e1",
        colorBgContainer: "#1e293b",
        rowHoverBg: "#334155",
        borderColor: "#334155",
      },

      Layout: {
        colorBgHeader: "#1e293b",
        colorBgBody: "#0f172a",
        colorBgTrigger: "#334155",
        bodyBg: "#0f172a",
        headerBg: "#1e293b",
        headerHeight: 64,
        headerPadding: "0 24px",
        headerColor: "#e2e8f0",
        footerBg: "#1e293b",
        footerPadding: "24px 50px",
      },
    },
  };

  return isDark ? darkTheme : lightTheme;
};
