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
      <label className="inline-flex items-center cursor-pointer text-neumorphic-400 dark:text-neumorphic-dark-400">
        <input
          type="checkbox"
          className="hidden"
          checked={isDark}
          onChange={handleToggle}
          aria-label="Toggle theme"
        />
        <div className={`
          isolate relative h-[30px] w-[60px] rounded-[15px] transition-shadow duration-300
          bg-neumorphic-100 dark:bg-neumorphic-dark-100
          shadow-lg border border-neumorphic-200/20 dark:border-neumorphic-dark-200/20
        `} style={{
            boxShadow: isDark
              ? '-4px -4px 8px rgb(60, 60, 60), 4px 4px 8px rgb(25, 25, 25), 2px 2px 4px rgb(25, 25, 25), -2px -2px 4px rgb(60, 60, 60) inset'
              : '-4px -4px 8px #ffffff, 4px 4px 8px #d1d9e6, 2px 2px 4px #d1d9e6 inset, -2px -2px 4px #ffffff inset'
          }}>
          <Sun
            className={`
              absolute w-4 h-4 text-amber-500 z-10 transition-all duration-300
              ${!isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-90'}
            `}
            style={{
              left: '7.5px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />

          <Moon
            className={`
              absolute w-4 h-4 text-slate-200 z-10 transition-all duration-300
              ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}
            `}
            style={{
              right: '7.5px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />

          <div
            className={`
              h-full w-[30px] rounded-[15px] transition-transform duration-[400ms] ease-[cubic-bezier(0.85,0.05,0.18,1.35)]
              bg-gradient-to-r ${isDark
                ? 'from-neumorphic-dark-100 to-neumorphic-dark-50'
                : 'from-neumorphic-100 to-neumorphic-50'
              }
              ${isDark ? 'translate-x-[30px]' : 'translate-x-0'}
            `}
            style={{
              boxShadow: isDark
                ? '-4px -4px 6px rgb(25, 25, 25), 4px 4px 6px rgb(25, 25, 25)'
                : '-4px -4px 6px #ffffff, 4px 4px 6px #d1d9e6'
            }}
          ></div>
        </div>
      </label>
    </div>
  );
}
