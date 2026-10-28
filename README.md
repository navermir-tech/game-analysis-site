# 게임 분석 및 제안서 아카이브

황은진의 게임 역기획 · 심층 분석 · 재설계 제안서를 모아 두는 정적 사이트입니다.
EL 기획서 아카이브 사이트와 같은 구조(Next.js + Tailwind)에 강조색만 에메랄드로 바꿨습니다.

## 로컬에서 확인하기

Node.js 20.9 이상(권장 22)이 필요합니다.

```bash
npm install        # 처음 한 번
npm run dev        # http://localhost:3000 에서 확인, 파일을 고치면 바로 반영
```

배포용 정적 파일은 `npm run build`로 만듭니다. 결과물이 `out/` 폴더에 생기고, 이 폴더를 그대로 Netlify에 올리면 됩니다.

## 분석서 추가하기

1. `content/analysis/<slug>.md` 파일을 만듭니다. 형식은 기존 파일을 참고하세요 (아래 '본문 형식').
2. `lib/analysis.ts`의 `analysisItems` 배열에 항목을 추가합니다 (slug, 카테고리, 게임, 제목, 부제, 한 줄 소개, 썸네일, 태그 등). 제목은 화면에 `게임 | 제목` 형태로 표시됩니다.
   - 새 게임이면 같은 파일의 `games` 배열에 한 줄을 더합니다. 홈의 게임 필터 탭이 자동으로 늘어납니다.
3. 썸네일(16:9)과 상단 배너(3:1)를 `public/images/`에 넣습니다. SVG·PNG 모두 됩니다.

카테고리는 `reverse`(역기획) · `analysis`(심층 분석) · `proposal`(재설계 제안) 세 가지이고, `lib/analysis.ts`에서 이름과 배지 색을 바꿀 수 있습니다.

본문의 그림(`![...](...)`)은 클릭하면 크게 볼 수 있고, 다른 분석서는 `[글자](/analysis/<slug>)` 형태로 링크합니다.

## 본문 형식

마크다운에 몇 가지 블록을 더한 형식입니다 (`lib/doc-parser.ts`).

```
## 큰 제목            ### 소제목            #### 작은 제목
본문 문단, **굵게**, `코드`, [링크](https://…)
- 글머리 (두 칸 들여쓰면 중첩)       1. 번호 목록
> 인용                                ---  (구분선)
![설명](/images/그림.svg "캡션")
| 표 | 머리 |
|---|---|
| 값 | 값 |

::: stats                  값 | 라벨 | 보조 설명   (한 줄에 하나씩, 숫자 타일)
::: callout key            종류: note · key · warn · result. 첫 줄 **제목**은 제목으로
::: cards 2                ### 카드 제목 {배지}  로 카드를 나눔. 숫자는 열 수
::: flow                   예고 → 추적 → 회수   (→ 로 나눈 단계 띠)
::: details 제목           접힘 상자
:::                        블록 닫기
```

## 색 바꾸기

`app/globals.css`의 `@theme` 블록에서 `--color-accent`(주 강조색) 등 토큰만 바꾸면 사이트 전체에 적용됩니다.
히어로 배경의 점 격자 색은 `components/hero.tsx`의 `rgba(62, 207, 142, …)`에 따로 적혀 있습니다.

## 폴더 구조

```
app/                 페이지와 레이아웃 (홈, /analysis/[slug], 404)
components/          헤더·푸터·히어로·소개·아카이브 카드·상세 페이지·본문 렌더러
content/analysis/    분석서 본문 (.md)
lib/                 분석서 목록, 본문 파서, 사이트 공통 설정
public/images/       썸네일·배너·그림 (SVG)
tools/figures.py     그림 SVG를 다시 만드는 스크립트 (python3 tools/figures.py public/images)
tools/figures_maple.py  메이플스토리 기획서의 루프 그림·썸네일·배너 (python3 tools/figures_maple.py public/images)
```

## 배포 (Netlify)

- **끌어다 올리기** — `npm run build` 뒤 `out/` 폴더를 Netlify 사이트의 Deploys 탭에 드래그
- **Git 연동** — 저장소를 연결하면 `netlify.toml` 설정(빌드 `npm run build`, 게시 폴더 `out`, Node 22)으로 자동 배포
