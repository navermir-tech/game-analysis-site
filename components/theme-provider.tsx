"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

export type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

/** 다크/라이트 테마 저장소. 기본은 다크, 선택은 localStorage에 저장됩니다. */
const listeners = new Set<() => void>();
let memory: Theme | null = null; // localStorage를 쓸 수 없는 환경을 위한 임시 저장

function readTheme(): Theme {
  if (memory) return memory;
  try {
    return (localStorage.getItem("theme") as Theme | null) ?? "dark";
  } catch {
    return "dark";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeTheme(next: Theme) {
  memory = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* 저장이 막힌 환경(시크릿 모드 등)에서는 조용히 넘어갑니다 */
  }
  listeners.forEach((l) => l());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 서버에서는 항상 다크로 그리고, 클라이언트에서 저장된 값으로 바꿉니다.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggle = () => writeTheme(theme === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** 테마별로 자주 쓰는 클래스 묶음. 컴포넌트마다 조건문을 반복하지 않기 위한 것입니다. */
export function palette(theme: Theme) {
  const dark = theme === "dark";
  return {
    dark,
    /** 섹션 배경 */
    bg: dark ? "bg-night" : "bg-day",
    bgDeep: dark ? "bg-night-deep" : "bg-day-deep",
    /** 카드 */
    card: dark ? "bg-night-card" : "bg-white",
    border: dark ? "border-white/5" : "border-black/5",
    borderSoft: dark ? "border-white/8" : "border-black/8",
    divider: dark ? "border-white/10" : "border-black/10",
    /** 글자 */
    text: dark ? "text-white" : "text-ink",
    body: dark ? "text-white/65" : "text-ink/65",
    muted: dark ? "text-white/50" : "text-ink-muted",
    faint: dark ? "text-white/30" : "text-ink-muted/60",
    /** 칩·배경 */
    chip: dark ? "bg-white/5 text-white/50 border-white/10" : "bg-black/5 text-black/50 border-black/10",
    hoverTab: dark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-ink-muted hover:text-ink hover:bg-black/5",
  };
}
