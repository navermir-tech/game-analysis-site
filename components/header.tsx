"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { site } from "@/lib/site";

const navItems = [
  { href: "/#about", label: "소개" },
  { href: "/#archive", label: "분석서" },
  { href: "/#contact", label: "연락처" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkColor = dark ? "text-white/70" : "text-ink/70";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? dark
            ? "bg-night/95 backdrop-blur-md border-b border-white/5"
            : "bg-day/95 backdrop-blur-md border-b border-black/5"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide"
          style={{ fontFamily: "Pretendard, 'Apple SD Gothic Neo', sans-serif" }}
        >
          <span className={dark ? "text-white" : "text-ink"}>{site.owner}</span>
          <span className={`ml-2 text-xs font-medium tracking-widest uppercase ${dark ? "text-white/40" : "text-ink/40"}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
            Analysis
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-accent ${linkColor}`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={toggle}
            aria-label="테마 전환"
            className={`p-2 rounded-full transition-all duration-200 hover:bg-accent/10 ${linkColor}`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggle} aria-label="테마 전환" className={`p-2 ${linkColor}`}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen((v) => !v)} aria-label="메뉴" className={linkColor}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className={`md:hidden border-t px-6 py-4 flex flex-col gap-4 ${
            dark ? "bg-night border-white/5" : "bg-day border-black/5"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors hover:text-accent ${linkColor}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
