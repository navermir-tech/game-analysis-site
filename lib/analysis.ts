/**
 * 분석서 목록 — 새 분석서를 추가할 때는 여기 항목 하나와 content/analysis/<slug>.md 파일을 추가합니다.
 * 새 게임이면 games 에 한 줄을 더하고, 항목의 game 에 그 key 를 적습니다.
 */
export type Category = "reverse" | "analysis" | "proposal";

export const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "reverse", label: "역기획" },
  { key: "analysis", label: "심층 분석" },
  { key: "proposal", label: "재설계 제안" },
];

export const categoryLabel: Record<Category, string> = {
  reverse: "역기획",
  analysis: "심층 분석",
  proposal: "재설계 제안",
};

/** 카테고리 배지 색 — 역기획 에메랄드 · 심층 분석 은빛 · 재설계 제안 금빛 */
export const categoryBadge: Record<Category, string> = {
  reverse: "bg-accent/15 text-accent border-accent/20",
  analysis: "bg-accent-2/15 text-accent-2 border-accent-2/25",
  proposal: "bg-accent-3/15 text-accent-3 border-accent-3/25",
};

/** 분석한 게임 — 홈의 게임 필터 탭과 제목의 '게임 | 문서' 표기에 쓰입니다. */
export const games = [{ key: "hogwarts-legacy", label: "호그와트 레거시", year: 2023 }] as const;

export type GameKey = (typeof games)[number]["key"];

export const gameLabel = (key: GameKey) => games.find((g) => g.key === key)?.label ?? key;

export type AnalysisItem = {
  slug: string;
  category: Category;
  game: GameKey;
  /** 문서 이름. 화면에는 '게임 | 문서 이름' 으로 표시됩니다. */
  title: string;
  /** 제목 아래 한 줄 부제 */
  subtitle: string;
  logline: string;
  thumbnail: string;
  /** 상세 페이지 상단 배너 (제목 없는 넓은 그림) */
  hero: string;
  tags: string[];
  /** 본문 맨 위 한 줄 안내 */
  intro: string;
  /** 분석서 카드 아래 '함께 보기' */
  relatedSlugs: string[];
  updated: string;
};

/** 화면 표시용 전체 제목 — '호그와트 레거시 | 메인 퀘스트 역기획' */
export function fullTitle(item: AnalysisItem) {
  return `${gameLabel(item.game)} | ${item.title}`;
}

export const analysisItems: AnalysisItem[] = [
  {
    slug: "hogwarts-legacy-reverse-design",
    category: "reverse",
    game: "hogwarts-legacy",
    title: "메인 퀘스트 역기획",
    subtitle: "수업은 교과서, 시험은 템플릿",
    logline:
      "메인 퀘스트 43개를 시스템·UI/UX·시나리오의 세 층으로 분해했다. 메인은 '무엇을 할 수 있게 되는가'를 통제하고 성장은 오픈월드에 맡기는 교대 리듬, 네 번 반복되는 파수꾼의 시험 템플릿, 그리고 모든 정체 지점이 '보이지 않는 조건'에서 생긴다는 사실을 찾아냈다.",
    thumbnail: "/images/thumb-reverse.svg",
    hero: "/images/hero-reverse.svg",
    tags: ["퀘스트 시스템", "UI·UX", "시나리오", "오픈월드 RPG"],
    intro: "출시작의 메인 퀘스트를 공략·위키·개발자 발표 자료로 재구성한 역기획입니다. 퀘스트·인물명은 나무위키 한글 표기를 따랐습니다.",
    relatedSlugs: ["hogwarts-legacy-deep-dive", "hogwarts-legacy-ending-redesign"],
    updated: "2026.10",
  },
  {
    slug: "hogwarts-legacy-deep-dive",
    category: "analysis",
    game: "hogwarts-legacy",
    title: "탐험 유도와 선택의 무게",
    subtitle: "란록을 잡은 10명 중 4명은 왜 떠났나",
    logline:
      "스팀 업적 퍼널과 선택지 14개 전수조사로 두 가지를 진단했다. 메인은 '도구 지급 → 게이트' 리듬으로 탐험을 유도하지만 에필로그에서 그 리듬이 끊기고, 몰입은 세계·관계·미스터리가 지탱하지만 게임이 스스로 무게를 실은 선택은 결과로 돌아오지 않는다.",
    thumbnail: "/images/thumb-deep-dive.svg",
    hero: "/images/hero-deep-dive.svg",
    tags: ["데이터 분석", "업적 퍼널", "선택과 결과", "서사 몰입"],
    intro:
      "스팀 글로벌 업적 통계, 개발진 발언, 리뷰·커뮤니티 반응을 근거로 한 심층 분석입니다. 업적으로 계산한 이탈률은 상관관계이며 인과를 증명하지 않습니다. 결말까지 스포일러를 포함합니다.",
    relatedSlugs: ["hogwarts-legacy-reverse-design", "hogwarts-legacy-ending-redesign"],
    updated: "2026.10",
  },
  {
    slug: "hogwarts-legacy-ending-redesign",
    category: "proposal",
    game: "hogwarts-legacy",
    title: "엔딩 분기 재설계 제안",
    subtitle: "어둠의 흔적 · 세바스찬 설득 · 세 갈래 선택",
    logline:
      "저주의 실제 사용, 세바스찬 설득, 최종 선택을 하나의 결말 구조로 묶는 제안. 숨은 점수와 속죄 규칙, 네 창구의 설득 판정, 결말별 포스트게임 월드까지 설계하고, 플레이어 유형 7종 검산과 20만 명 몬테카를로 감도 분석으로 수치를 정했다.",
    thumbnail: "/images/thumb-redesign.svg",
    hero: "/images/hero-redesign.svg",
    tags: ["시스템 설계", "내러티브 설계", "분기 구조", "감도 분석"],
    intro:
      "세바스찬 관계 퀘스트와 결말 전체를 다룹니다. 신규 대사와 설정은 제안용 초안이며 원작 대사를 옮긴 것이 아닙니다. 수치는 플레이테스트로 보정하는 가안입니다.",
    relatedSlugs: ["hogwarts-legacy-deep-dive", "hogwarts-legacy-reverse-design"],
    updated: "2026.10",
  },
];

export function getItem(slug: string) {
  return analysisItems.find((item) => item.slug === slug);
}
