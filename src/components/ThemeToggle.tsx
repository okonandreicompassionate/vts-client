import { SunOutlined, MoonOutlined, DesktopOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const items: MenuProps["items"] = [
    {
      key: "light",
      icon: <SunOutlined />,
      label: "Light",
      onClick: () => setTheme("light"),
    },
    {
      key: "dark",
      icon: <MoonOutlined />,
      label: "Dark",
      onClick: () => setTheme("dark"),
    },
    {
      type: "divider",
    },
    {
      key: "system",
      icon: <DesktopOutlined />,
      label: "System",
      onClick: () => setTheme("system"),
    },
  ];

  const getIcon = () => {
    if (theme === "dark") return <MoonOutlined className="text-base" />;
    if (theme === "light") return <SunOutlined className="text-base" />;
    return <DesktopOutlined className="text-base" />;
  };

  return (
    <Dropdown menu={{ items, selectedKeys: [theme] }} placement="bottomRight" trigger={["click"]}>
      <Button
        type="text"
        icon={getIcon()}
        className="flex h-9! w-9! items-center justify-center text-slate-600! hover:bg-slate-100!"
        title="Toggle theme"
      />
    </Dropdown>
  );
}
