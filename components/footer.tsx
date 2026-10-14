"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { palette, useTheme } from "@/components/theme-provider";
import { site } from "@/lib/site";

export function Footer() {
  const { theme } = useTheme();
  const p = palette(theme);

  const external = [site.links.resume, site.links.portfolio];

  return (
    <footer
      id="contact"
      className={`${p.dark ? "bg-night-deep" : "bg-day-footer"} border-t ${p.border} py-12 px-6`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className={`text-lg font-semibold ${p.text}`} style={{ fontFamily: "var(--font-playfair-var, Georgia, serif)" }}>
            {site.owner} <span className={`text-sm font-normal ${p.faint}`}>{site.role}</span>
          </p>
          <p className={`text-xs mt-1 ${p.faint}`}>게임 역기획 · 심층 분석 · 재설계 제안</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {external.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 hover:border-accent/40 hover:text-accent ${p.border} ${p.card} ${p.muted}`}
            >
              {link.label}
              <ArrowUpRight size={12} />
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            aria-label="이메일"
            className={`p-2 rounded-full transition-all duration-200 ${p.dark ? "text-white/40" : "text-ink-muted/60"} hover:text-accent hover:bg-accent/10`}
          >
            <Mail size={18} />
          </a>
        </div>

        <p className={`text-xs ${p.faint}`}>© {new Date().getFullYear()} {site.owner}. All rights reserved.</p>
      </div>
    </footer>
  );
}
