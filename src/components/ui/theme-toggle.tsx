import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { useTheme } from "@/lib/contexts/theme/use-theme";

/** On = dark, off = light. Until it is first used, the theme follows the system setting. */
export function ThemeToggle() {
  const { setTheme, isDark } = useTheme();

  return (
    <Switch
      checked={isDark}
      onChange={(checked) => setTheme(checked ? "dark" : "light")}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    />
  );
}
