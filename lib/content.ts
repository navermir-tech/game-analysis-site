import fs from "node:fs";
import path from "node:path";
import { parseDoc, type Block } from "@/lib/doc-parser";

/** content/analysis/<slug>.md 를 읽어 블록으로 파싱합니다 (빌드 시점에만 실행). */
export function loadAnalysisDoc(slug: string): Block[] {
  const file = path.join(process.cwd(), "content", "analysis", `${slug}.md`);
  const source = fs.readFileSync(file, "utf-8");
  return parseDoc(source);
}
