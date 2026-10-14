"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Gamepad2, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { SectionReveal } from "@/components/section-reveal";
import { palette, useTheme } from "@/components/theme-provider";
import {
  analysisItems,
  categories,
  categoryBadge,
  categoryLabel,
  fullTitle,
  gameLabel,
  games,
  type AnalysisItem,
  type Category,
  type GameKey,
} from "@/lib/analysis";

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
            <img src={item.thumbnail} alt={fullTitle(item)} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${categoryBadge[item.category]}`}>
                {categoryLabel[item.category]}
              </span>
              <span className={`text-[11px] ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                {item.updated}
              </span>
            </div>
            <h3 className={`font-semibold text-base leading-snug mb-1 break-keep ${p.text} group-hover:text-accent transition-colors duration-200`}>
              <span className={p.muted}>{gameLabel(item.game)}</span>
              <span className={`mx-1.5 ${p.faint}`}>|</span>
              {item.title}
            </h3>
            <p className={`text-xs mb-3 ${p.muted}`}>{item.subtitle}</p>
            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${p.muted}`}>{item.logline}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.slice(0, 3).map((t) => (
                  <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full border ${p.borderSoft} ${p.muted}`}>
                    {t}
                  </span>
                ))}
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

type TabKey = string;

function TabRow<K extends TabKey>({
  label,
  icon,
  tabs,
  active,
  onChange,
  layoutId,
}: {
  label: string;
  icon: React.ReactNode;
  tabs: { key: K; label: string; count: number }[];
  active: K;
  onChange: (k: K) => void;
  layoutId: string;
}) {
  const { theme } = useTheme();
  const p = palette(theme);
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 text-[11px] tracking-widest uppercase w-24 shrink-0 ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
        {icon}
        {label}
      </span>
      <div className="flex gap-1 flex-wrap" role="tablist" aria-label={label}>
        {tabs.map((t) => {
          const selected = active === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(t.key)}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selected ? "text-night" : p.hoverTab}`}
            >
              <span className="relative z-10">
                {t.label}
                <span className={`ml-1.5 text-[11px] ${selected ? "text-night/60" : p.faint}`}>{t.count}</span>
              </span>
              {selected && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Archive() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [game, setGame] = useState<GameKey | "all">("all");
  const { theme } = useTheme();
  const p = palette(theme);

  const byGame = game === "all" ? analysisItems : analysisItems.filter((i) => i.game === game);
  const byCategory = category === "all" ? analysisItems : analysisItems.filter((i) => i.category === category);
  const items = byGame.filter((i) => category === "all" || i.category === category);

  const gameTabs = [
    { key: "all" as const, label: "전체", count: byCategory.length },
    ...games.map((g) => ({ key: g.key, label: g.label, count: byCategory.filter((i) => i.game === g.key).length })),
  ];
  const categoryTabs = categories.map((c) => ({
    key: c.key,
    label: c.label,
    count: c.key === "all" ? byGame.length : byGame.filter((i) => i.category === c.key).length,
  }));

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
          <div className={`flex flex-col gap-3 mb-10 pb-6 border-b ${p.divider}`}>
            <TabRow label="Game" icon={<Gamepad2 size={12} />} tabs={gameTabs} active={game} onChange={setGame} layoutId="game-tab-indicator" />
            <TabRow label="Type" icon={<LayoutGrid size={12} />} tabs={categoryTabs} active={category} onChange={setCategory} layoutId="category-tab-indicator" />
          </div>
        </SectionReveal>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <Card key={item.slug} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
        {items.length === 0 && <div className={`text-center py-20 ${p.muted}`}>이 조건에 맞는 분석서가 아직 없습니다.</div>}
      </div>
    </section>
  );
}
