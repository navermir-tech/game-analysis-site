"use client";

import { ChevronDown } from "lucide-react";
import type { Block, CalloutKind } from "@/lib/doc-parser";
import { palette, useTheme, type Theme } from "@/components/theme-provider";
import { Inline } from "@/components/doc/inline";
import { Figure } from "@/components/doc/figure";

const mono = { fontFamily: "var(--font-jetbrains-var, monospace)" } as const;

export function DocRenderer({ blocks }: { blocks: Block[] }) {
  const { theme } = useTheme();
  return (
    <div className="space-y-1">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} theme={theme} />
      ))}
    </div>
  );
}

function BlockView({ block, theme }: { block: Block; theme: Theme }) {
  const p = palette(theme);
  const strong = p.dark ? "text-white/90" : "text-ink";
  const bodyText = p.dark ? "text-white/60" : "text-ink-muted";

  switch (block.type) {
    case "h2":
      return (
        <h2
          id={block.id}
          className={`text-xl font-bold mt-12 mb-4 pb-2 first:mt-0 border-b scroll-mt-24 ${p.text} ${p.dark ? "border-accent/25" : "border-accent/35"}`}
        >
          <Inline text={block.text} strongClass={strong} />
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className={`text-base font-semibold mt-8 mb-2 pb-1.5 border-b scroll-mt-24 ${p.divider} ${p.text}`}>
          <Inline text={block.text} strongClass={strong} />
        </h3>
      );
    case "h4":
      return (
        <h4 className={`text-sm font-semibold mt-5 mb-1.5 ${p.text}`}>
          <Inline text={block.text} strongClass={strong} />
        </h4>
      );
    case "p":
      return (
        <p className={`text-sm leading-relaxed ${bodyText}`}>
          <Inline text={block.text} strongClass={strong} />
        </p>
      );
    case "ul":
      return (
        <div className="space-y-1 my-1">
          {block.items.map((it, i) => (
            <div key={i} className={`flex gap-2 text-sm leading-relaxed ${bodyText}`} style={{ paddingLeft: it.depth * 16 }}>
              <span className={`mt-1 shrink-0 text-xs ${it.depth === 0 ? "text-accent" : ""}`}>{it.depth === 0 ? "•" : "–"}</span>
              <span>
                <Inline text={it.text} strongClass={strong} />
              </span>
            </div>
          ))}
        </div>
      );
    case "ol":
      return (
        <div className="space-y-1.5 my-2">
          {block.items.map((it, i) => (
            <div key={i} className={`flex items-start gap-2.5 text-sm leading-relaxed ${bodyText}`}>
              <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold bg-accent text-night">
                {i + 1}
              </span>
              <span>
                <Inline text={it} strongClass={strong} />
              </span>
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote
          className={`my-3 pl-4 border-l-2 italic text-sm py-2 pr-3 rounded-r leading-relaxed ${
            p.dark ? "bg-white/5 border-l-white/30 text-white/60" : "bg-gray-50 border-l-gray-300 text-ink-muted"
          }`}
        >
          <Inline text={block.text} strongClass={strong} />
        </blockquote>
      );
    case "hr":
      return <hr className={`my-8 border-t ${p.divider}`} />;
    case "figure":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} theme={theme} />;
    case "table":
      return (
        <div className={`doc-table-wrap my-4 rounded-xl border ${p.border}`}>
          <table className={`w-full text-left text-sm border-collapse ${block.header.length >= 4 ? "min-w-[720px]" : block.header.length === 3 ? "min-w-[520px]" : ""} md:min-w-0`}>
            <thead>
              <tr className={p.dark ? "bg-white/5" : "bg-black/5"}>
                {block.header.map((h, i) => (
                  <th key={i} className={`px-3 py-2 text-xs font-semibold whitespace-nowrap ${p.muted}`}>
                    <Inline text={h} strongClass={strong} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className={`border-t ${p.border}`}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2 align-top leading-relaxed ${ci === 0 ? `font-medium ${p.text}` : bodyText} ${
                        cell.length <= 8 ? "whitespace-nowrap" : ""
                      }`}
                    >
                      <Inline text={cell} strongClass={strong} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "stats":
      return (
        <div className={`grid gap-3 my-5 ${block.items.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : block.items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
          {block.items.map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border ${p.border} ${p.dark ? "bg-night" : "bg-day"}`}>
              <div className={`font-bold text-accent leading-none ${s.value.length > 6 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`} style={{ letterSpacing: "-0.01em" }}>
                {s.value}
              </div>
              <div className={`mt-2 text-sm font-semibold ${p.text}`}>{s.label}</div>
              {s.note && <div className={`mt-1 text-xs leading-relaxed ${p.muted}`}>{s.note}</div>}
            </div>
          ))}
        </div>
      );
    case "callout":
      return <Callout kind={block.kind} title={block.title} theme={theme} body={block.body} />;
    case "cards":
      return (
        <div className={`grid gap-4 my-5 ${block.columns >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : block.columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
          {block.cards.map((c, i) => (
            <div key={i} className={`p-5 rounded-xl border ${p.border} ${p.dark ? "bg-night" : "bg-day"}`}>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <h4 className={`text-sm font-semibold ${p.text}`}>
                  <Inline text={c.title} strongClass={strong} />
                </h4>
                {c.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border bg-accent/15 text-accent border-accent/20 font-medium">
                    {c.badge}
                  </span>
                )}
              </div>
              <div className="space-y-1 [&_p]:text-xs [&_div]:text-xs">
                {c.body.map((b, j) => (
                  <BlockView key={j} block={b} theme={theme} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    case "flow":
      return (
        <div className="flex flex-wrap items-center gap-2 my-4">
          {block.steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${p.border} ${p.dark ? "bg-night text-white/80" : "bg-day text-ink"}`}>
                <Inline text={s} strongClass={strong} />
              </span>
              {i < block.steps.length - 1 && <span className="text-accent text-sm">→</span>}
            </div>
          ))}
        </div>
      );
    case "details":
      return (
        <details className={`group my-3 rounded-xl border ${p.border} ${p.dark ? "bg-night/60" : "bg-day"}`}>
          <summary className={`flex items-center justify-between gap-3 cursor-pointer select-none px-4 py-3 text-sm font-semibold ${p.text} list-none`}>
            <span>{block.summary}</span>
            <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 group-open:rotate-180 ${p.muted}`} />
          </summary>
          <div className={`px-4 pb-4 pt-1 border-t ${p.border} space-y-1`}>
            {block.body.map((b, j) => (
              <BlockView key={j} block={b} theme={theme} />
            ))}
          </div>
        </details>
      );
    default:
      return null;
  }
}

function Callout({ kind, title, body, theme }: { kind: CalloutKind; title: string; body: Block[]; theme: Theme }) {
  const p = palette(theme);
  const styles: Record<CalloutKind, { border: string; bg: string; label: string; labelText: string }> = {
    note: { border: p.dark ? "border-white/20" : "border-black/20", bg: p.dark ? "bg-white/[0.03]" : "bg-black/[0.03]", label: "메모", labelText: p.muted },
    key: { border: "border-accent", bg: "bg-accent/5", label: "핵심", labelText: "text-accent" },
    warn: { border: "border-accent-3", bg: "bg-accent-3/8", label: "주의", labelText: "text-accent-3" },
    result: { border: "border-accent-2", bg: "bg-accent-2/8", label: "결론", labelText: "text-accent-2" },
  };
  const s = styles[kind];
  return (
    <div className={`my-4 pl-4 pr-4 py-3 rounded-r-xl border-l-2 ${s.border} ${s.bg}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`text-[10px] font-semibold uppercase tracking-widest ${s.labelText}`} style={mono}>
          {s.label}
        </span>
        {title && <span className={`text-sm font-semibold ${p.text}`}>{title}</span>}
      </div>
      <div className="space-y-1">
        {body.map((b, j) => (
          <BlockView key={j} block={b} theme={theme} />
        ))}
      </div>
    </div>
  );
}
