"use client";

import { SectionReveal } from "@/components/section-reveal";
import { palette, useTheme } from "@/components/theme-provider";

const roles = [
  {
    title: "역기획",
    desc: "출시작의 퀘스트·시스템·UI·시나리오를 공통 기준으로 분해해, 설계 의도를 관찰 사실과 가설로 나눠 기록합니다.",
  },
  {
    title: "심층 분석",
    desc: "업적 통계·선택지 전수조사 같은 데이터로 어디서 작동하고 어디서 무너지는지 진단하고, 설계 규칙으로 뽑아냅니다.",
  },
  {
    title: "재설계 제안",
    desc: "진단에서 나온 요구사항을 시스템·내러티브 설계로 답하고, 유형별 검산과 시뮬레이션으로 수치를 정합니다.",
  },
];

/** 분해 → 진단 → 제안. 그림 파일 대신 실제 글자로 그려 어떤 화면에서도 읽힙니다. */
const steps = [
  { no: "01", title: "분해", sub: "역기획", desc: "퀘스트 · 시스템 · UI · 시나리오를 공통 기준으로 분해", color: "text-accent", border: "border-accent/60" },
  { no: "02", title: "진단", sub: "심층 분석", desc: "업적 통계 · 선택지 전수조사로 작동하는 곳과 무너지는 곳을 찾기", color: "text-accent-2", border: "border-accent-2/60" },
  { no: "03", title: "제안", sub: "재설계 제안", desc: "시스템 · 내러티브 설계, 검산과 시뮬레이션으로 수치 결정", color: "text-accent-3", border: "border-accent-3/60" },
];

function ProcessDiagram() {
  const { theme } = useTheme();
  const p = palette(theme);
  return (
    <figure className={`rounded-2xl mb-8 p-5 md:p-6 ${p.card} border ${p.border}`} aria-label="분해 → 진단 → 제안으로 이어지는 분석 과정">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 sm:gap-2 items-stretch">
        {steps.map((s, i) => (
          <div key={s.no} className="contents">
            <div className={`rounded-xl border-2 ${s.border} ${p.dark ? "bg-night" : "bg-day"} p-4 md:p-5 flex flex-col`}>
              <span className={`text-xl md:text-2xl font-bold leading-none ${s.color}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                {s.no}
              </span>
              <span className={`text-2xl md:text-3xl font-bold mt-2 leading-none ${p.text}`}>{s.title}</span>
              <span className={`text-xs font-semibold mt-1.5 ${s.color}`}>{s.sub}</span>
              <span className={`text-xs leading-relaxed mt-3 break-keep ${p.muted}`}>{s.desc}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center text-accent text-xl sm:text-2xl rotate-90 sm:rotate-0 -my-2 sm:my-0" aria-hidden="true">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <figcaption className={`mt-4 text-xs text-center ${p.muted}`}>한 게임을 끝까지 따라간다 — 결론만 읽으려면 각 문서의 {"'한눈에 보기'"}</figcaption>
    </figure>
  );
}

const tools = ["스팀 업적 통계", "선택지 전수조사", "몬테카를로 시뮬레이션 (Python)", "머메이드 다이어그램", "노션", "클로드 코드"];

export function About() {
  const { theme } = useTheme();
  const p = palette(theme);

  return (
    <section id="about" className={`section-padding ${p.bg}`}>
      <div className="max-w-7xl mx-auto">
        <SectionReveal>
          <div className="mb-16">
            <span className={`text-xs font-medium tracking-widest uppercase ${p.muted}`} style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
              About the Archive
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 ${p.text}`} style={{ fontFamily: "var(--font-playfair-var, Georgia, serif)" }}>
              분석서 소개
            </h2>
          </div>
        </SectionReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionReveal direction="left">
              <ProcessDiagram />
              <div className={`space-y-4 ${p.muted} text-base leading-relaxed`}>
                <p>
                  잘 만든 게임을 뜯어보면 설계의 문법이 보이고, 데이터를 대 보면 그 문법이 어디서 끊기는지 보입니다. 이 아카이브는 한 게임을{" "}
                  <span className={`font-semibold ${p.text}`}>분해 → 진단 → 제안</span>의 순서로 끝까지 따라간 기록입니다.
                </p>
                <p>
                  모든 제안은 원작의 장면과 규칙 위에 짓고, 수치는 가안으로 두되 검산과 시뮬레이션으로 근거를 남깁니다. 결론만 읽고 싶은 분을 위해 각 문서는{" "}
                  {"'한눈에 보기'"}로 시작합니다.
                </p>
              </div>
            </SectionReveal>
          </div>

          <div className="space-y-10">
            <SectionReveal direction="right" delay={0.1}>
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${p.text}`}>세 단계로 읽는 분석서</h3>
                <div className="grid sm:grid-cols-1 gap-4">
                  {roles.map((r, i) => (
                    <div key={r.title} className={`p-4 rounded-xl ${p.card} border ${p.border} flex gap-4`}>
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-accent text-night font-bold text-sm flex items-center justify-center" style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}>
                        {i + 1}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm mb-1 ${p.text}`}>{r.title}</h4>
                        <p className={`text-xs leading-relaxed ${p.muted}`}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={0.2}>
              <div>
                <h3 className={`text-lg font-semibold mb-6 ${p.text}`}>분석에 쓴 도구와 방법</h3>
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span
                      key={t}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${p.border} ${p.card} ${p.muted} hover:border-accent/40 hover:text-accent transition-colors duration-200`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
