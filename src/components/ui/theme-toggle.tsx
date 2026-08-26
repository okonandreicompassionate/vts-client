import { useTheme } from "@/features/theme/hooks/use-theme";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const getIcon = () => {
    if (theme === "dark") return <MoonOutlined className="text-base" />;
    if (theme === "light") return <SunOutlined className="text-base" />;
    return isDark ? (
      <MoonOutlined className="text-base" />
    ) : (
      <SunOutlined className="text-base" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Toggle theme"
          className="icon-button flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-600 outline-none hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {getIcon()}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) =>
            setTheme(value as "light" | "dark" | "system")
          }
        >
          <DropdownMenuRadioItem value="light">
            <SunOutlined />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonOutlined />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}