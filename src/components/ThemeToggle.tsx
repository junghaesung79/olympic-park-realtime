"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-16" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        applyTheme(next);
      }}
      aria-pressed={isDark}
      aria-label="라이트/다크 모드 전환"
      className="flex h-8 items-center gap-1.5 rounded-full border border-zinc-300 px-3 text-sm text-zinc-600 transition hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
    >
      <span>{isDark ? "다크" : "라이트"}</span>
    </button>
  );
}
