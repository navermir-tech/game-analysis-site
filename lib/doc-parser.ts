/**
 * 분석서 본문 파서 — 마크다운에 몇 가지 블록 지시문을 더한 형식을 블록 트리로 바꿉니다.
 *
 *   ## 제목 / ### 소제목 / #### 작은 제목
 *   본문 문단, - 글머리(2칸 들여쓰기로 중첩), 1. 번호 목록, > 인용, ---
 *   ![설명](경로 "캡션")
 *   | 표 | 머리 |   (둘째 줄 |---|---|)
 *
 *   ::: stats            값 | 라벨 | 보조 설명  (한 줄에 하나)
 *   ::: callout key      종류: note(기본) · key · warn · result   첫 줄 **제목** 은 제목으로
 *   ::: cards 2          ### 카드 제목 {배지}  로 카드를 나눔, 숫자는 열 수
 *   ::: flow             예고 → 추적 → 회수   (→ 로 나눈 단계 띠)
 *   ::: details 제목     접힘 상자
 *   :::                  지시문 닫기
 */

export type Block =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "h4"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: { text: string; depth: number }[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "figure"; src: string; alt: string; caption: string }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "stats"; items: { value: string; label: string; note: string }[] }
  | { type: "callout"; kind: CalloutKind; title: string; body: Block[] }
  | { type: "cards"; columns: number; cards: { title: string; badge: string; body: Block[] }[] }
  | { type: "flow"; steps: string[] }
  | { type: "details"; summary: string; body: Block[] };

export type CalloutKind = "note" | "key" | "warn" | "result";

export function slugify(text: string, used: Set<string>) {
  const base =
    text
      .replace(/\*\*/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "section";
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

export function parseDoc(source: string): Block[] {
  const used = new Set<string>();
  return parseLines(source.replace(/\r\n/g, "\n").split("\n"), used);
}

function parseLines(lines: string[], used: Set<string>): Block[] {
  const blocks: Block[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) blocks.push({ type: "p", text: buf.join(" ") });
    buf.length = 0;
  };

  const para: string[] = [];

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph(para);
      i++;
      continue;
    }

    // 지시문 블록
    if (trimmed.startsWith(":::") && trimmed !== ":::") {
      flushParagraph(para);
      const head = trimmed.slice(3).trim();
      const [name, ...rest] = head.split(/\s+/);
      const arg = rest.join(" ");
      // 닫는 ::: 찾기 (중첩 허용)
      let depth = 1;
      let j = i + 1;
      const inner: string[] = [];
      while (j < lines.length) {
        const t = lines[j].trim();
        if (t.startsWith(":::") && t !== ":::") depth++;
        else if (t === ":::") {
          depth--;
          if (depth === 0) break;
        }
        inner.push(lines[j]);
        j++;
      }
      blocks.push(parseDirective(name, arg, inner, used));
      i = j + 1;
      continue;
    }

    // 제목
    const h = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (h) {
      flushParagraph(para);
      const level = h[1].length;
      const text = h[2].trim();
      if (level === 2) blocks.push({ type: "h2", text, id: slugify(text, used) });
      else if (level === 3) blocks.push({ type: "h3", text, id: slugify(text, used) });
      else blocks.push({ type: "h4", text });
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph(para);
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    const fig = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/.exec(trimmed);
    if (fig) {
      flushParagraph(para);
      blocks.push({ type: "figure", alt: fig[1], src: fig[2], caption: fig[3] ?? "" });
      i++;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph(para);
      const q: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        q.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "quote", text: q.join(" ") });
      continue;
    }

    if (trimmed.startsWith("|")) {
      flushParagraph(para);
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim());
        i++;
      }
      const cells = (r: string) =>
        r
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
      const header = cells(rows[0]);
      const body = rows.slice(1).filter((r) => !/^\|?\s*:?-{2,}/.test(r));
      blocks.push({ type: "table", header, rows: body.map(cells) });
      continue;
    }

    // 글머리 (들여쓰기로 중첩)
    if (/^\s*[-•]\s+/.test(line)) {
      flushParagraph(para);
      const items: { text: string; depth: number }[] = [];
      while (i < lines.length && /^\s*[-•]\s+/.test(lines[i])) {
        const m = /^(\s*)[-•]\s+(.*)$/.exec(lines[i])!;
        items.push({ depth: Math.min(2, Math.floor(m[1].replace(/\t/g, "  ").length / 2)), text: m[2].trim() });
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushParagraph(para);
  return blocks;
}

function parseDirective(name: string, arg: string, inner: string[], used: Set<string>): Block {
  switch (name) {
    case "stats": {
      const items = inner
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [value = "", label = "", note = ""] = l.split("|").map((s) => s.trim());
          return { value, label, note };
        });
      return { type: "stats", items };
    }
    case "callout": {
      const kind = (["note", "key", "warn", "result"].includes(arg) ? arg : "note") as CalloutKind;
      const body = [...inner];
      let title = "";
      const first = body.find((l) => l.trim() !== "");
      if (first && /^\*\*[^*]+\*\*$/.test(first.trim())) {
        title = first.trim().replace(/\*\*/g, "");
        body.splice(body.indexOf(first), 1);
      }
      return { type: "callout", kind, title, body: parseLines(body, used) };
    }
    case "cards": {
      const columns = Math.max(1, Math.min(4, parseInt(arg, 10) || 2));
      const cards: { title: string; badge: string; body: Block[] }[] = [];
      let cur: { title: string; badge: string; lines: string[] } | null = null;
      for (const l of inner) {
        const m = /^###\s+(.*)$/.exec(l.trim());
        if (m) {
          if (cur) cards.push({ title: cur.title, badge: cur.badge, body: parseLines(cur.lines, used) });
          let title = m[1].trim();
          let badge = "";
          const b = /\{([^}]*)\}\s*$/.exec(title);
          if (b) {
            badge = b[1].trim();
            title = title.replace(/\{[^}]*\}\s*$/, "").trim();
          }
          cur = { title, badge, lines: [] };
        } else if (cur) {
          cur.lines.push(l);
        }
      }
      if (cur) cards.push({ title: cur.title, badge: cur.badge, body: parseLines(cur.lines, used) });
      return { type: "cards", columns, cards };
    }
    case "flow": {
      const text = inner.map((l) => l.trim()).filter(Boolean).join(" → ");
      return { type: "flow", steps: text.split("→").map((s) => s.trim()).filter(Boolean) };
    }
    case "details":
      return { type: "details", summary: arg || "더 보기", body: parseLines(inner, used) };
    default:
      return { type: "callout", kind: "note", title: "", body: parseLines(inner, used) };
  }
}

/** 목차용 — h2 제목만 */
export function headings(blocks: Block[]) {
  return blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: b.id, text: b.text }));
}
