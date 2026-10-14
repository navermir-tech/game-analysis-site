import type { ReactNode } from "react";

/**
 * 인라인 마크업 — **굵게**, `코드`, [글자](주소)
 */
export function Inline({ text, strongClass }: { text: string; strongClass: string }) {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key++} className={`font-semibold ${strongClass}`}>
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded text-[0.8em] bg-accent/10 text-accent"
          style={{ fontFamily: "var(--font-jetbrains-var, monospace)" }}
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else {
      const lm = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(tok)!;
      const external = /^https?:/.test(lm[2]);
      nodes.push(
        <a
          key={key++}
          href={lm[2]}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
        >
          {lm[1]}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
