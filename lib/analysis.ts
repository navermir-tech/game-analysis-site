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
export const games = [
  { key: "hogwarts-legacy", label: "호그와트 레거시", year: 2023 },
  { key: "maplestory", label: "메이플스토리", year: 2003 },
] as const;

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
  {
    slug: "maplestory-market-gap-analysis",
    category: "analysis",
    game: "maplestory",
    title: "KMS·GMS·해외 서버 동향과 빈틈",
    subtitle: "시간을 줄인 KMS, 이유를 더한 해외 — 후보 7개에서 하나를 고르기까지",
    logline:
      "2025~2026년 KMS·GMS 업데이트 13건과 JMS·TMS·CMS·MSEA의 독자 콘텐츠를 서버별 '방향'으로 묶고, 같은 본편을 쓰는 두 서버를 8개 축으로 비교해 어느 쪽도 다루지 않은 자리를 찾았다. 그 자리를 메울 결합 원칙 5개를 세우고, 후보 7개를 다섯 기준으로 걸러 하나를 골랐다. 떨어진 후보에서 무엇을 흡수했는지까지 적었다.",
    thumbnail: "/images/thumb-maple-gap.svg",
    hero: "/images/hero-maple-gap.svg",
    tags: ["업데이트 동향", "경쟁 분석", "문제 정의", "후보 평가"],
    intro:
      "공식 패치 노트·쇼케이스 정리와 2차 보도를 근거로 한 동향 분석입니다. 조사 기준일은 2026-10-08, 사실 재확인은 10-28입니다. 자료의 신뢰도는 문서 끝에 A~D 등급으로 표시했고, '강점과 빈틈'·'결합 원칙'·후보 평가는 자료가 아닌 판단입니다.",
    relatedSlugs: ["maplestory-mentorship-deep-dive", "maplestory-companion-proposal"],
    updated: "2026.10",
  },
  {
    slug: "maplestory-mentorship-deep-dive",
    category: "analysis",
    game: "maplestory",
    title: "사제·멘토링 시스템 심층 분석",
    subtitle: "같은 자리를 세 번 채운 메이플, 사례 6건이 가리키는 한 가지 규칙",
    logline:
      "메이플 패밀리(2008)부터 MSEA 멘토십(2026)까지 사제·멘토링 시스템 6건을 7개 축으로 비교해 반복되는 실패 모드 6개를 찾고, 설계 원칙 7개로 바꿨다. 성패는 보상이 활동량에 걸리느냐 제자의 성장에 걸리느냐로 갈린다. 보스 1인 격파 업적률로 스승 허들을, 시즌 캘린더와 이탈 곡선으로 복귀 기준 84일을 숫자로 정했다.",
    thumbnail: "/images/thumb-maple-mentorship.svg",
    hero: "/images/hero-maple-mentorship.svg",
    tags: ["사례 비교", "시스템 분석", "데이터 분석", "보상 설계"],
    intro:
      "TMS 사제 시스템·홍월의 숲 공식 안내와 MSEA v253 패치 노트는 전문을 읽었고, 패밀리·FFXIV·검은사막은 위키와 보도 기준입니다. 업적 달성률 환산과 이탈 곡선은 커뮤니티 집계와 PC방 점유율 보도를 보간한 추정이며, 넥슨 내부 데이터가 아닙니다.",
    relatedSlugs: ["maplestory-market-gap-analysis", "maplestory-companion-proposal"],
    updated: "2026.10",
  },
  {
    slug: "maplestory-companion-proposal",
    category: "proposal",
    game: "maplestory",
    title: "길잡이 동행 콘텐츠 기획서",
    subtitle: "스승 1 · 제자 1 · 주 1회 15분 원정 — 관계로 굴러가는 콘텐츠",
    logline:
      "KMS의 '플레이 타임 압축 · 솔로 기본' 기조와 해외 서버의 사제 시스템을 겹쳐 비어 있는 자리를 찾고, 거기에 숙련 유저와 신규·복귀 유저가 12주 동안 한 쌍으로 도는 15분 2인 던전을 제안한다. 스승 보상의 트리거를 활동량이 아니라 제자의 성장에 걸어 선행 사례 7건의 실패 모드를 피했고, 화면 목업 14장과 코인 경제, 지표 검증 설계까지 한 문서에 담았다.",
    thumbnail: "/images/thumb-maple-companion.svg",
    hero: "/images/hero-maple-companion.svg",
    tags: ["콘텐츠 기획", "관계형 시스템", "매칭 · 보상 설계", "UI 목업", "라이브 운영"],
    intro:
      "KMS·GMS·해외 서버 동향 조사와 사제·멘토링 사례 7건 분석을 바탕으로 쓴 콘텐츠 기획서입니다. 게임 사실은 2026-10-28 기준으로 확인했고, 수치는 출처를 적지 않은 한 가정값입니다. 화면 이미지는 ChatGPT로 만든 목업이며 실제 리소스가 아닙니다.",
    relatedSlugs: ["maplestory-companion-detail", "maplestory-mentorship-deep-dive", "maplestory-market-gap-analysis"],
    updated: "2026.10",
  },
  {
    slug: "maplestory-companion-detail",
    category: "proposal",
    game: "maplestory",
    title: "길잡이 동행 상세 설계",
    subtitle: "던전 화면 · 수호자 · 리듬 전투 · 졸업식 대본 · 배움 과제 풀",
    logline:
      "기획서 본문에서 떼어 낸 제작 사양. 세 스테이지에서 제자와 스승이 각자 보는 화면과 알림 흐름, 보스 '수호자'의 캐릭터 디자인과 패턴 상태 시트, 선창–응답 리듬 전투의 키 배치·단계별 노트·판정, 3막 졸업식의 시간별 대본과 연출 시안 6장, 배움 과제 풀 36개를 담았다.",
    thumbnail: "/images/thumb-maple-detail.svg",
    hero: "/images/hero-maple-detail.svg",
    tags: ["레벨 디자인", "보스 설계", "리듬 전투", "연출 대본", "UI 목업"],
    intro:
      "'길잡이 동행 콘텐츠 기획서'의 상세 설계서입니다. 절 번호는 본문과 같은 체계를 쓰며, 여기 없는 번호(6-2 · 6-7 · 7-1 · 7-3 등)는 본문의 절입니다. 화면·컨셉 이미지는 ChatGPT로 만든 목업이며 실제 리소스가 아닙니다.",
    relatedSlugs: ["maplestory-companion-proposal"],
    updated: "2026.10",
  },
];

export function getItem(slug: string) {
  return analysisItems.find((item) => item.slug === slug);
}
