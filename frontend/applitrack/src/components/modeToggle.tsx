import { useTheme } from "@/shared/contexts/themeProvider";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-center p-2">
      <button
        onClick={handleToggle}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted border border-border transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out ${
            isDark ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-foreground m-0.5" />
          ) : (
            <Sun className="h-3 w-3 text-foreground m-0.5" />
          )}
        </span>
      </button>
    </div>
  );
}
