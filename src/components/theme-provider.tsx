import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type Ctx = {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("rocsta-theme") as Theme | null;

    const initialTheme: Theme =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";

    setThemeState(initialTheme);

    const initialResolved = initialTheme === "system" ? getSystemTheme() : initialTheme;

    setResolved(initialResolved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [resolved]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      setResolved(getSystemTheme());
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem("rocsta-theme", t);

    setThemeState(t);

    if (t === "system") {
      setResolved(getSystemTheme());
    } else {
      setResolved(t);
    }
  };

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        resolved,
        setTheme,
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);

  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return ctx;
}
