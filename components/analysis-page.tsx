"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { DocRenderer } from "@/components/doc/doc-renderer";
import { palette, useTheme } from "@/components/theme-provider";
import { categoryBadge, categoryLabel, type AnalysisItem } from "@/lib/analysis";
import { headings, type Block } from "@/lib/doc-parser";

export function AnalysisPage({ item, blocks, related }: { item: AnalysisItem; blocks: Block[]; related: AnalysisItem[] }) {
  const { theme } = useTheme();
  const p = palette(theme);
  const toc = headings(blocks);

  return (
    <article className={`min-h-screen pt-16 ${p.bg}`}>
      {/* 상단 이미지 띠 */}
      <div className="relative w-full max-h-[480px] overflow-hidden bg-night-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.hero} alt="" className="w-full h-auto object-cover block" />
        <div
          className="absolute inset-x-0 bottom-0 h-56"
          style={{ background: `linear-gradient(to top, ${p.dark ? "#231f20" : "#f7f8f9"}, transparent)` }}
          aria-hidden="true"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link
            href="/#archive"
            className={`inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200 hover:text-accent ${p.muted}`}
          >
            <ArrowLeft size={14} />
            목록으로 돌아가기
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryBadge[item.category]}`}>{categoryLabel[item.category]}</span>
            <span className={`text-xs ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
              {item.game}
            </span>
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold mb-4 leading-tight ${p.text}`}>{item.title}</h1>
          <p className={`text-base md:text-lg leading-relaxed ${p.muted}`}>{item.logline}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {item.tags.map((t) => (
              <span key={t} className={`px-3 py-1 rounded-full text-xs font-medium border ${p.border} ${p.card} ${p.muted}`}>
                {t}
              </span>
            ))}
          </div>
          <div className={`flex flex-wrap items-center gap-4 mt-5 text-xs ${p.muted}`}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={12} /> {item.updated}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} /> 읽는 데 약 {item.readingMinutes}분
            </span>
          </div>
        </motion.div>

        <div className={`rounded-2xl border ${p.borderSoft} ${p.card} p-6 md:p-8`}>
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-lg font-semibold ${p.text}`}>분석서 전문</h2>
          </div>
          <p className={`text-xs mb-5 ${p.muted}`}>{item.intro}</p>

          {toc.length > 1 && (
            <nav aria-label="목차" className={`mb-8 p-4 rounded-xl border ${p.border} ${p.dark ? "bg-night" : "bg-day"}`}>
              <div className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                Contents
              </div>
              <ol className="flex flex-wrap gap-x-4 gap-y-1.5">
                {toc.map((h, i) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className={`text-xs transition-colors hover:text-accent ${p.muted}`}>
                      <span className="text-accent/70 mr-1" style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <DocRenderer blocks={blocks} />
        </div>

        {related.length > 0 && (
          <>
            <div className={`border-t ${p.border} mt-16`} />
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="mt-16">
                <h2 className={`text-xl font-semibold mb-6 ${p.text}`}>함께 보기</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/analysis/${r.slug}`} className="group block">
                      <div className={`p-5 rounded-xl border ${p.borderSoft} ${p.card} transition-all duration-200 group-hover:border-accent/30 group-hover:shadow-lg h-full`}>
                        <span className={`text-[10px] font-medium uppercase tracking-wider mb-2 block ${p.muted}`}>{categoryLabel[r.category]}</span>
                        <h3 className={`font-semibold text-sm mb-1 ${p.text} group-hover:text-accent transition-colors duration-200`}>{r.title}</h3>
                        <p className={`text-xs line-clamp-2 mb-3 ${p.muted}`}>{r.logline}</p>
                        <span className="flex items-center gap-1 text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          읽어보기 <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </article>
  );
}
