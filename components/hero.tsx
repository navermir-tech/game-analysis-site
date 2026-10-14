"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import { site } from "@/lib/site";

/** 배경에 천천히 일렁이는 점 격자 — 강조색을 아주 옅게 씁니다. */
function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / 40);
      const rows = Math.ceil(canvas.height / 40);
      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          const px = x * 40;
          const py = y * 40;
          const a = (Math.sin((px + frame) * 0.01) * Math.cos((py + frame) * 0.01) + 1) * 0.06 + 0.02;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(62, 207, 142, ${a})`;
          ctx.fill();
        }
      }
      frame += 0.6;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

export function Hero() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <DotField />
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(ellipse at center, rgba(35,31,32,0.6) 0%, rgba(35,31,32,0.95) 70%)"
            : "radial-gradient(ellipse at center, rgba(247,248,249,0.6) 0%, rgba(247,248,249,0.95) 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="w-8 h-px bg-accent" />
          <span className="text-accent text-sm font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
            Game Analysis &amp; Proposal
          </span>
          <span className="w-8 h-px bg-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "Pretendard, 'Apple SD Gothic Neo', sans-serif" }}
        >
          <span className="gradient-text">{site.owner}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto ${dark ? "text-white/60" : "text-ink/60"}`}
        >
          {site.tagline[0]}
          <br className="hidden md:block" />
          {site.tagline[1]}
        </motion.p>

        <motion.a
          href="#archive"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="group inline-flex items-center gap-3 bg-accent text-night px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-accent-strong transition-all duration-300 shadow-lg shadow-accent/20"
        >
          분석서 보러가기
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className={`text-xs tracking-widest ${dark ? "text-white/30" : "text-ink/30"}`}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
