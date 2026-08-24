import { useEffect, useState } from "react";
import { type Theme, ThemeContext } from "./theme-context";

function resolveIsDark(theme: Theme) {
  return theme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : theme === "dark";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  });

  const [isDark, setIsDark] = useState(() => resolveIsDark(theme));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const dark = theme === "system" ? mediaQuery.matches : theme === "dark";

      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";

      setIsDark(dark);
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }

  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}