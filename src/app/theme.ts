import { theme as antdTheme } from "antd";

// Same stack as --font-sans in index.css.
const APP_FONT_FAMILY =
  '"Raleway Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const globalFontSize = 12;
const globalFormFieldHeight = 40;
// size="small": table toolbars, row actions and other compact spots.
const globalCompactControlHeight = 32;

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
  controlHeightSM: globalCompactControlHeight,
  controlHeightLG: globalFormFieldHeight,
};

const globalFieldRadius = 8;

/** One look for every text field, select, picker and number input. */
const getFieldTokens = (isDark: boolean) => ({
  ...globalFormFieldHeightTokens,
  borderRadius: globalFieldRadius,
  colorBgContainer: isDark ? "#27272a" : "#ffffff",
  colorText: isDark ? "#e4e4e7" : "#1f2937",
  colorTextPlaceholder: isDark ? "#8b8b94" : "#9ca3af",
  colorBorder: isDark ? "#3f3f46" : "#d1d5db",
  colorBgContainerDisabled: isDark ? "#18181b" : "#f3f4f6",
  colorTextDisabled: isDark ? "#71717a" : "#9ca3af",
});

const getFieldComponents = (isDark: boolean) => {
  const fieldTokens = getFieldTokens(isDark);

  return {
    Input: fieldTokens,
    InputNumber: fieldTokens,
    Select: fieldTokens,
    DatePicker: fieldTokens,
    Form: {
      labelFontSize: globalFontSize,
      labelHeight: 20,
      labelColor: isDark ? "#d4d4d8" : "#374151",
      verticalLabelPadding: "0 0 2px",
      itemMarginBottom: 4,
    },
  };
};

/** No shadows anywhere: borders separate surfaces (see the overlay rules in index.css). */
const noShadowTokens = {
  boxShadow: "none",
  boxShadowSecondary: "none",
  boxShadowTertiary: "none",
};

const globalButtonTokens = {
  paddingInline: 10,
  paddingInlineSM: 8,
  paddingInlineLG: 10,
  paddingBlock: 0,
  paddingBlockSM: 0,
  paddingBlockLG: 0,
  defaultShadow: "none",
  primaryShadow: "none",
  dangerShadow: "none",
};

export const getThemeConfig = (isDark: boolean) => {
  const lightTheme = {
    token: {
      ...globalTypographyTokens,
      ...globalFormFieldHeightTokens,
      ...noShadowTokens,
      colorPrimary: "#0ea5e9",
      colorInfo: "#0ea5e9",
      colorPrimaryHover: "#0284c7",
      colorPrimaryActive: "#0369a1",
      borderRadius: 12,
      fontFamily: APP_FONT_FAMILY,
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
      ...getFieldComponents(false),

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
      ...noShadowTokens,
      colorPrimary: "#0ea5e9",
      colorInfo: "#0ea5e9",
      colorPrimaryHover: "#0284c7",
      colorPrimaryActive: "#0369a1",
      borderRadius: 12,
      fontFamily: APP_FONT_FAMILY,
      colorBgBase: "#18181b",
      colorTextBase: "#e4e4e7",
      colorBorder: "#3f3f46",
      colorBgContainer: "#27272a",
      colorBgElevated: "#27272a",
      colorBgLayout: "#18181b",
      colorBgBlur: "#18181baa",
    },

    components: {
      ...getFieldComponents(true),

      Button: {
        ...globalFormFieldHeightTokens,
        ...globalButtonTokens,

        colorBgBase: "#27272a",

        defaultBg: "#27272a",
        defaultColor: "#e4e4e7",
        defaultBorderColor: "#52525b",

        defaultHoverBg: "#3f3f46",
        defaultHoverColor: "#fafafa",
        defaultHoverBorderColor: "#71717a",

        defaultActiveBg: "#3f3f46",
        defaultActiveColor: "#fafafa",
        defaultActiveBorderColor: "#71717a",

        primaryBg: "#0ea5e9",
        primaryColor: "#fafafa",
        primaryBorderColor: "#0ea5e9",

        primaryHoverBg: "#0284c7",
        primaryHoverColor: "#fafafa",
        primaryHoverBorderColor: "#0284c7",

        primaryActiveBg: "#0369a1",
        primaryActiveColor: "#fafafa",
        primaryActiveBorderColor: "#0369a1",

        primaryShadow: "none",
      },

      Card: {
        colorBgContainer: "#27272a",
        colorBorderSecondary: "#3f3f46",
      },

      Modal: {
        contentBg: "#27272a",
        headerBg: "#27272a",
        titleColor: "#e4e4e7",
      },

      Checkbox: {
        colorBgContainer: "#27272a",
        colorBorder: "#52525b",
      },

      Table: {
        headerBg: "#18181b",
        headerColor: "#d4d4d8",
        colorBgContainer: "#27272a",
        rowHoverBg: "#3f3f46",
        borderColor: "#3f3f46",
      },

      Layout: {
        colorBgHeader: "#27272a",
        colorBgBody: "#18181b",
        colorBgTrigger: "#3f3f46",
        bodyBg: "#18181b",
        headerBg: "#27272a",
        headerHeight: 64,
        headerPadding: "0 24px",
        headerColor: "#e4e4e7",
        footerBg: "#27272a",
        footerPadding: "24px 50px",
      },
    },
  };

  return isDark ? darkTheme : lightTheme;
};
