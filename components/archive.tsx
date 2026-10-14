"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "@/components/section-reveal";
import { palette, useTheme } from "@/components/theme-provider";
import { analysisItems, categories, categoryBadge, categoryLabel, type AnalysisItem, type Category } from "@/lib/analysis";

function Card({ item, index }: { item: AnalysisItem; index: number }) {
  const { theme } = useTheme();
  const p = palette(theme);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: 0.08 * index, ease: [0.4, 0, 0.2, 1] }}
      layout
    >
      <Link href={`/analysis/${item.slug}`} className="block group">
        <article
          className={`rounded-2xl overflow-hidden border ${p.borderSoft} ${p.card} transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-black/30 group-hover:border-accent/20`}
        >
          <div className="relative aspect-video overflow-hidden bg-night-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.thumbnail} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${categoryBadge[item.category]}`}>
                {categoryLabel[item.category]}
              </span>
              <span className={`text-[11px] ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                {item.game}
              </span>
            </div>
            <h3 className={`font-semibold text-base mb-2 ${p.text} group-hover:text-accent transition-colors duration-200`}>{item.title}</h3>
            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${p.muted}`}>{item.logline}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.tags.slice(0, 3).map((t) => (
                <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${p.borderSoft} ${p.muted}`}>
                  {t}
                </span>
              ))}
            </div>
            <div className={`flex items-center justify-between text-xs ${p.muted}`}>
              <span className="inline-flex items-center gap-1">
                <Clock size={11} /> 약 {item.readingMinutes}분
              </span>
              <span className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                읽어보기
                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function Archive() {
  const [active, setActive] = useState<Category | "all">("all");
  const { theme } = useTheme();
  const p = palette(theme);
  const items = active === "all" ? analysisItems : analysisItems.filter((i) => i.category === active);

  return (
    <section id="archive" className={`section-padding ${p.bgDeep}`}>
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <div className="mb-12">
            <span className={`text-xs font-medium tracking-widest uppercase ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
              Archive
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 ${p.text}`} style={{ fontFamily: "var(--font-playfair-var, Georgia, serif)" }}>
              게임 분석 및 제안서 아카이브
            </h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="flex gap-1 mb-10 flex-wrap" role="tablist">
            {categories.map((c) => {
              const selected = active === c.key;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(c.key)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selected ? "text-night bg-accent" : p.hoverTab
                  }`}
                >
                  {c.label}
                  {selected && (
                    <motion.span
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 rounded-full bg-accent"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </SectionReveal>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <Card key={item.slug} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
        {items.length === 0 && <div className={`text-center py-20 ${p.muted}`}>해당 카테고리의 분석서가 아직 없습니다.</div>}
      </div>
    </section>
  );
}
