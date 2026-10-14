"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { palette, type Theme } from "@/components/theme-provider";

/**
 * 본문 그림. 클릭하면 화면 가득 확대해서 볼 수 있습니다.
 * 닫기: X 버튼 · ESC · 바깥 영역 클릭
 */
const noop = () => () => {};

export function Figure({ src, alt, caption, theme }: { src: string; alt: string; caption?: string; theme: Theme }) {
  const p = palette(theme);
  const [open, setOpen] = useState(false);
  // 서버 렌더링 때는 포털을 만들지 않습니다(브라우저에서만 true).
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <figure className="my-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt || caption || "그림"} 크게 보기`}
        className={`group relative block w-full rounded-xl overflow-hidden border text-left cursor-zoom-in transition-colors duration-200 hover:border-accent/50 focus-visible:border-accent ${p.border} ${
          p.dark ? "bg-night-media" : "bg-white"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
        <span
          className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur transition-opacity duration-200 opacity-70 group-hover:opacity-100 ${
            p.dark ? "bg-night/80 text-white/80 border border-white/10" : "bg-white/85 text-ink border border-black/10"
          }`}
        >
          <Maximize2 size={11} />
          크게 보기
        </span>
      </button>
      {caption && <figcaption className={`mt-2 text-xs text-center ${p.muted}`}>{caption}</figcaption>}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={caption || alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 md:p-8 cursor-zoom-out"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="absolute top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-accent hover:text-night transition-colors duration-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-[1600px] w-full max-h-[85vh] overflow-auto rounded-xl md:flex md:items-center md:justify-center cursor-default"
                >
                  {/* 작은 화면에서는 그림을 넓게 펼치고 좌우로 밀어 볼 수 있게 합니다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className="block min-w-[960px] md:min-w-0 md:max-w-full md:max-h-[85vh] w-auto h-auto rounded-xl bg-night-media shadow-2xl" />
                </motion.div>
                {caption && <p className="mt-4 text-sm text-white/70 text-center max-w-3xl">{caption}</p>}
                <p className="mt-1 text-[11px] text-white/40 text-center" style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                  <span className="md:hidden">좌우로 밀어 보기 · 바깥을 누르면 닫힙니다</span>
                  <span className="hidden md:inline">ESC 또는 바깥을 클릭하면 닫힙니다</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </figure>
  );
}
