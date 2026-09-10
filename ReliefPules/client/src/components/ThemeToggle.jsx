import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', variant = 'button' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
          isDark
            ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[11px] font-bold">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
            <span className="text-[11px] font-bold">Dark</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl transition-all border flex items-center justify-center ${
        isDark
          ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700/80'
          : 'bg-white text-slate-600 border-[#E4EAF2] hover:text-[#1268E8] hover:bg-slate-50 shadow-xs'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 transition-transform -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
