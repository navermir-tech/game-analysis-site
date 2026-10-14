"""사이트 색으로 분석서 그림과 썸네일 SVG를 생성합니다.
사용: python3 figures.py <public/images 경로>
"""
import sys, os, math

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

BG = "#1a1718"; CARD = "#2a2627"; CARD2 = "#231f20"
TXT = "#f3f4f5"; MUT = "#a7a9ad"; DIM = "#6b6e73"; LINE = "#3a3537"
ACC = os.environ.get("ACCENT", "#3ecf8e"); ACC2 = os.environ.get("ACCENT2", "#9fb7c9"); ACC3 = "#e2b85a"; RED = "#e36b6b"; VIO = "#b79cf0"
FONT = "Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans CJK KR', 'Noto Sans KR', sans-serif"
MONO = "'JetBrains Mono', 'Cascadia Code', Consolas, monospace"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class SVG:
    def __init__(self, w, h, bg=BG):
        self.w, self.h = w, h
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" font-family="{FONT}">',
                      f'<rect width="{w}" height="{h}" fill="{bg}"/>']
        self.defs = []

    def add(self, s):
        self.parts.append(s)

    def text(self, x, y, s, size=18, fill=TXT, anchor="start", weight=400, mono=False, opacity=1, style=""):
        ff = MONO if mono else FONT
        self.add(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}" font-family="{ff}" opacity="{opacity}" {style}>{esc(s)}</text>')

    def lines(self, x, y, items, size=15, fill=MUT, lh=None, anchor="start", weight=400):
        lh = lh or int(size * 1.5)
        for i, s in enumerate(items):
            self.text(x, y + i * lh, s, size, fill, anchor, weight)

    def box(self, x, y, w, h, fill=CARD, stroke=LINE, r=14, sw=1.5, opacity=1):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" opacity="{opacity}"/>')

    def pill(self, x, y, w, h, label, fill=ACC, color="#1a1718", size=14, weight=700):
        self.box(x, y, w, h, fill=fill, stroke="none", r=h / 2)
        self.text(x + w / 2, y + h / 2 + size * 0.36, label, size, color, "middle", weight)

    def arrow(self, x1, y1, x2, y2, color=MUT, dashed=False, sw=2, head=True):
        dash = ' stroke-dasharray="6 6"' if dashed else ""
        mid = f'marker-end="url(#ah-{color.strip("#")})"' if head else ""
        self.defs.append(color)
        self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{dash} {mid}/>')

    def path(self, d, color=MUT, dashed=False, sw=2, head=True, fill="none"):
        dash = ' stroke-dasharray="6 6"' if dashed else ""
        mid = f'marker-end="url(#ah-{color.strip("#")})"' if head else ""
        self.defs.append(color)
        self.add(f'<path d="{d}" fill="{fill}" stroke="{color}" stroke-width="{sw}"{dash} {mid}/>')

    def node(self, x, y, w, h, title, sub=None, fill=CARD, stroke=LINE, tcolor=TXT, size=17, r=14, subcolor=MUT, subsize=13):
        self.box(x, y, w, h, fill, stroke, r)
        if sub:
            self.text(x + w / 2, y + h / 2 - 4, title, size, tcolor, "middle", 600)
            self.text(x + w / 2, y + h / 2 + subsize + 6, sub, subsize, subcolor, "middle")
        else:
            self.text(x + w / 2, y + h / 2 + size * 0.36, title, size, tcolor, "middle", 600)

    def diamond(self, cx, cy, w, h, title, fill=CARD2, stroke=ACC3, tcolor=TXT, size=15, sub=None):
        self.add(f'<polygon points="{cx},{cy-h/2} {cx+w/2},{cy} {cx},{cy+h/2} {cx-w/2},{cy}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>')
        if sub:
            self.text(cx, cy - 2, title, size, tcolor, "middle", 600)
            self.text(cx, cy + 16, sub, 12, MUT, "middle")
        else:
            self.text(cx, cy + size * 0.36, title, size, tcolor, "middle", 600)

    def label(self, x, y, s, color=ACC, size=12):
        self.text(x, y, s, size, color, "start", 600, mono=True, style='letter-spacing="2"')

    def save(self, name):
        defs = ["<defs>"]
        for c in sorted(set(self.defs)):
            defs.append(f'<marker id="ah-{c.strip("#")}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>')
        defs.append("</defs>")
        self.parts.insert(2, "".join(defs))
        self.parts.append("</svg>")
        open(os.path.join(OUT, name), "w", encoding="utf-8").write("\n".join(self.parts))
        print("wrote", name)


# ---------------------------------------------------------------- 공통 썸네일 틀
def thumb_frame(s, kicker, title, sub):
    s.add(f'<rect width="{s.w}" height="{s.h}" fill="url(#g)"/>')
    s.parts.insert(2, f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#231f20"/><stop offset="1" stop-color="#15181a"/></linearGradient></defs>')
    # 점 격자
    for gx in range(0, s.w, 48):
        for gy in range(0, s.h, 48):
            s.add(f'<circle cx="{gx}" cy="{gy}" r="1.3" fill="{ACC}" opacity="0.08"/>')
    s.label(80, 96, kicker, ACC, 16)
    s.text(80, 160, title, 50, TXT, "start", 800)
    s.text(80, 206, sub, 22, MUT)


# ---------------------------------------------------------------- 1. 챕터 흐름 (역기획 그림 + 썸네일)
def chapter_flow(s, ox, oy, scale=1.0):
    chapters = [("프롤로그", "1–2", None), ("첫날", "3–6", None), ("제한 구역", "7–9", None), ("학교 생활", "10–13", None),
                ("지도 내실", "14–15", None), ("첫 시험", "16–20", "시험 1"), ("마지막 파수꾼", "21–29", "시험 2"),
                ("란록과 룩우드", "30–35", "시험 3"), ("O.W.L.", "36–38", "시험 4"), ("최후의 장", "39–40", None), ("에필로그", "41–43", None)]
    gates = {6: ("Lv12", "가을"), 7: ("Lv19", "겨울"), 10: ("Lv34", "봄·여름")}
    bw, bh, gap = 118 * scale, 70 * scale, 20 * scale
    x = ox
    y = oy
    for i, (name, rng, trial) in enumerate(chapters):
        if i in gates:
            lv, season = gates[i]
            gx = x + 2 * scale
            s.diamond(gx + 28 * scale, y + bh / 2, 56 * scale, 56 * scale, lv, size=12 * scale)
            s.text(gx + 28 * scale, y + bh + 22 * scale, season, 12 * scale, ACC3, "middle")
            x += 64 * scale + gap
        stroke = ACC if trial else LINE
        s.node(x, y, bw, bh, name, rng, stroke=stroke, size=15 * scale, subsize=12 * scale)
        if trial:
            s.pill(x + bw / 2 - 30 * scale, y - 16 * scale, 60 * scale, 22 * scale, trial, ACC, size=11 * scale)
        if i < len(chapters) - 1:
            s.arrow(x + bw, y + bh / 2, x + bw + gap - 2, y + bh / 2, DIM, head=False)
        x += bw + gap


s = SVG(1800, 420)
s.label(40, 48, "MAIN QUEST FLOW · 43 QUESTS · 11 CHAPTERS", ACC, 13)
s.text(40, 84, "메인 퀘스트 챕터 흐름과 레벨 게이트", 24, TXT, weight=700)
chapter_flow(s, 40, 150)
s.text(40, 300, "◆ 레벨 게이트 — 챕터 전환부의 Lv12 · Lv19 와 에필로그의 Lv34(하드 게이트). 메인 종료 시 레벨은 약 24–26이라 마지막 게이트 앞에 8–10레벨이 빈다", 14, MUT)
s.text(40, 326, "■ 에메랄드 테두리 — 네 번의 '파수꾼의 시험'. 같은 템플릿을 변주하고 시험마다 이사도라의 기억을 한 편씩 공개한다", 14, MUT)
s.text(40, 352, "주문 게이트(과제 → 메인) 7개와 편지·과제 트리거 3곳은 그림에서 생략", 13, DIM)
s.save("fig-chapter-flow.svg")

# 썸네일 — 역기획
s = SVG(1600, 900)
thumb_frame(s, "REVERSE DESIGN · HOGWARTS LEGACY", "메인 퀘스트 역기획", "시스템 · UI/UX · 시나리오의 세 층으로 분해")
s.add('<g transform="translate(0,0)">')
# 세 층 스택
layers = [("시나리오", "두 축 · 네 번의 시험 · 정보 공개", ACC3), ("UI / UX", "일지체 로그 · 요청형 안내 · 보이지 않는 조건", ACC2), ("시스템", "생명주기 · 다섯 겹 진입 조건 · 해금 레일", ACC)]
for i, (t, sub, c) in enumerate(layers):
    y = 300 + i * 150
    s.box(80, y, 620, 120, CARD, c, 18, 2)
    s.add(f'<rect x="80" y="{y}" width="10" height="120" rx="5" fill="{c}"/>')
    s.text(118, y + 52, t, 28, TXT, weight=700)
    s.text(118, y + 90, sub, 17, MUT)
# 오른쪽: 미니 챕터 흐름 (세로)
chs = ["프롤로그", "첫날", "제한 구역", "학교 생활", "지도 내실", "첫 시험 ★", "마지막 파수꾼 ★", "란록과 룩우드 ★", "O.W.L. ★", "최후의 장", "에필로그"]
gates = {5: "Lv12", 6: "Lv19", 9: "Lv34"}
x0 = 820
for i, c in enumerate(chs):
    y = 262 + i * 47
    s.box(x0, y, 420, 40, CARD2, ACC if "★" in c else LINE, 10)
    s.text(x0 + 18, y + 26, c.replace(" ★", ""), 16, TXT, weight=600)
    if "★" in c:
        s.pill(x0 + 330, y + 9, 72, 22, "시험", ACC, size=11)
    if i in gates:
        s.pill(x0 + 440, y + 8, 80, 24, gates[i], ACC3, "#1a1718", 12)
    if i < len(chs) - 1:
        s.add(f'<line x1="{x0+210}" y1="{y+40}" x2="{x0+210}" y2="{y+47}" stroke="{DIM}" stroke-width="2"/>')
s.add('</g>')
s.save("thumb-reverse.svg")

# ---------------------------------------------------------------- 2. 생명주기
s = SVG(1800, 460)
s.label(40, 48, "QUEST LIFECYCLE", ACC, 13)
s.text(40, 84, "퀘스트 생명주기 — 잠김에서 허브 구간까지", 24, TXT, weight=700)
states = [("잠김", "로그에 ??? 슬롯", LINE), ("시작 가능", "로그 자동 등록", LINE), ("진행 중", "활성 목표 1개", ACC), ("완료 가능", "마지막 보고만 남음", LINE), ("완료", "XP · 기능 해금", LINE), ("허브 구간", "순서를 플레이어가 고름", ACC3)]
labels = ["선행 완료 + 레벨·주문·편지", "NPC 대화 · 지점 도달", "순차 목표 완료", "보고 대화", "다음 메인 + 과제 + 사이드"]
bw, bh, gap = 220, 86, 72
x, y = 40, 160
for i, (t, sub, c) in enumerate(states):
    s.node(x, y, bw, bh, t, sub, stroke=c, size=18)
    if i < len(states) - 1:
        s.arrow(x + bw, y + bh / 2, x + bw + gap - 3, y + bh / 2, MUT)
        s.text(x + bw + gap / 2, y - 14, labels[i], 12, ACC2, "middle")
    x += bw + gap
# 사망 루프
s.path("M 700 246 C 700 320, 860 320, 860 246", ACC3, dashed=True)
s.text(780, 338, "사망 → 체크포인트 재시작 (실패 상태 없음)", 13, ACC3, "middle")
s.text(40, 410, "'일시 중단'은 명시적 상태가 아니라 추적 전환일 뿐이다. 수락 UI도 없어 등록은 자동, 시작은 대화, 끝은 보고다.", 14, MUT)
s.save("fig-lifecycle.svg")

# ---------------------------------------------------------------- 3. 두 축
s = SVG(1800, 560)
s.label(40, 48, "TWO NARRATIVE AXES", ACC, 13)
s.text(40, 84, "외적 축과 미스터리 축이 마지막 질문에서 만난다", 24, TXT, weight=700)
ext = [("금고 습격", "1"), ("빈 저장소", "29"), ("로드곡의 죽음", "37"), ("룩우드 처단", "39")]
mys = [("기억 1", "20"), ("기억 2", "29"), ("기억 3", "35"), ("기억 4 · 파수꾼의 진실", "38")]
def axis(items, y, color, title):
    s.text(40, y - 26, title, 14, color, weight=700)
    x = 40
    for i, (t, n) in enumerate(items):
        w = 250 if "진실" in t else 190
        s.node(x, y, w, 70, t, f"메인 {n}", stroke=color)
        if i < len(items) - 1:
            s.arrow(x + w, y + 35, x + w + 42, y + 35, color)
        x += w + 46
    return x
x1 = axis(ext, 160, ACC2, "외적 축 — 란록 · 룩우드와의 저장소 경쟁 (시간 압박)")
x2 = axis(mys, 340, ACC3, "미스터리 축 — 이사도라의 네 기억 ('다음 시험을 할 이유')")
qx, qy = 1180, 270
s.diamond(qx, qy, 300, 150, "저장소 앞의 질문", sub="봉인할 것인가, 쓸 것인가 · 메인 40", stroke=ACC)
s.path(f"M {x1-4} 195 C {x1+80} 195, {qx-230} 270, {qx-150} 270", ACC2)
s.path(f"M {x2-4} 375 C {x2+80} 375, {qx-230} 270, {qx-150} 270", ACC3)
s.node(1440, 235, 320, 70, "피그의 죽음 · 추모식 · 에필로그", stroke=LINE, size=16)
s.arrow(qx + 150, 270, 1436, 270, ACC)
s.text(40, 500, "두 축 모두 '힘을 어떻게 쓸 것인가'를 묻지만, 정작 플레이어의 힘 사용(저주)은 그 질문에 참여하지 못한다 — 심층 분석의 역설", 14, MUT)
s.save("fig-two-axes.svg")

# ---------------------------------------------------------------- 4. 퍼시벌 시험 흐름
s = SVG(1800, 520)
s.label(40, 48, "PERCIVAL RACKHAM'S TRIAL · 11 OBJECTIVES", ACC, 13)
s.text(40, 84, "퍼시벌 랙햄의 시험 — 목표 11개의 흐름", 24, TXT, weight=700)
steps = [("① 탑 앞 합류", "플루 + 빗자루"), ("② 캠프 조사", "투영 마법 · 페트리피쿠스"), ("③ 매복 섬멸", "로열리스트 암살자"), ("④ 탑 수색", "퍼시벌 초상화 · 피그 퇴장"), ("⑤ 숨은 입구", "고대 마법 웅덩이"), ("⑥ 시험의 문", "복귀 불가")]
steps2 = [("⑦ 시험 던전", "퍼즐 5 · 전투 3 · 저장 잠금"), ("펜시브 가디언", "아레나 웨이브 → 보스"), ("⑧ 유물 + 기억 1", "컷신"), ("⑨ 결정 아치", "지도 내실 귀환"), ("⑩ 보고", "찰스 룩우드 등장"), ("⑪ 핫스팟 해금", "260 XP · 가을 시작")]
def row(items, y, highlight):
    bw, bh, gap = 232, 78, 50
    x = 40
    for i, (t, sub) in enumerate(items):
        c = ACC3 if t in highlight else (ACC if "가디언" in t or "던전" in t else LINE)
        s.node(x, y, bw, bh, t, sub, stroke=c, size=16, subsize=12)
        if i < len(items) - 1:
            s.arrow(x + bw, y + bh / 2, x + bw + gap - 3, y + bh / 2, MUT)
        x += bw + gap
    return x
row(steps, 150, {"② 캠프 조사", "⑥ 시험의 문"})
s.path("M 1680 228 C 1760 228, 1760 300, 1680 300 L 1540 300 C 1200 300, 600 300, 100 300 L 60 300 C 20 300, 20 330, 40 340", MUT, head=False)
row(steps2, 340, set())
s.text(40, 470, "◆ 금빛 테두리 — 진행을 멈출 수 있는 지점. ② 텐트 속 편지를 조사하지 않으면 캠프를 전멸시켜도 넘어가지 않고(숨은 완료 조건), ⑥ 입장 뒤에는 탑으로 돌아갈 수 없다", 14, MUT)
s.text(40, 496, "■ 에메랄드 — 시험 본편. 퍼즐과 전투를 번갈아 배치하고, 마지막 퍼즐 이후 가디언 처치까지 수동 저장이 잠긴다", 14, MUT)
s.save("fig-trial-flow.svg")

# ---------------------------------------------------------------- 5. 업적 퍼널 (심층 그림 + 썸네일)
funnel = [("도입·배정", 92.4, "1–2"), ("첫 수업", 84.7, "3"), ("호그스미드 트롤", 77.3, "6"), ("퍼시벌의 시험", 55.4, "20"), ("불과 악행", 37.3, "30"),
          ("니암의 시험", 31.7, "35"), ("산 바카르의 시험", 27.7, "38"), ("란록 처치", 26.1, "40"), ("기숙사 우승컵", 14.8, "43")]
def draw_funnel(s, ox, oy, w, bar_h=44, gap=16, label_size=15, show_gate=True):
    maxw = w
    for i, (name, pct, n) in enumerate(funnel):
        y = oy + i * (bar_h + gap)
        bw = maxw * pct / 100
        last = i == len(funnel) - 1
        color = ACC3 if last else ACC
        s.add(f'<rect x="{ox}" y="{y}" width="{maxw}" height="{bar_h}" rx="8" fill="{CARD}"/>')
        s.add(f'<rect x="{ox}" y="{y}" width="{bw:.1f}" height="{bar_h}" rx="8" fill="{color}" opacity="{0.95 if last else 0.85}"/>')
        s.text(ox - 16, y + bar_h / 2 + 6, f"{name}", label_size, TXT, "end", 600)
        s.text(ox - 16, y + bar_h / 2 + 22, f"메인 {n}", 11, DIM, "end")
        s.text(ox + bw + 12, y + bar_h / 2 + 6, f"{pct}%", label_size + 1, TXT, "start", 700, mono=True)
        if i > 0:
            prev = funnel[i - 1][1]
            keep = pct / prev * 100
            s.text(ox + maxw + 14, y + bar_h / 2 + 6, f"잔존 {keep:.0f}%", 13, ACC3 if last else MUT, "start", 600 if last else 400)
    if show_gate:
        y = oy + 8 * (bar_h + gap)
        s.text(ox + maxw + 110, y + bar_h / 2 + 6, "← Lv34 하드 게이트", 13, ACC3, "start", 700)

s = SVG(1800, 720)
s.label(40, 48, "STEAM GLOBAL ACHIEVEMENTS · FUNNEL", ACC, 13)
s.text(40, 84, "메인 퀘스트 진행에 따른 업적 달성률", 24, TXT, weight=700)
draw_funnel(s, 300, 120, 1100)
s.text(40, 690, "달성률은 설치자 전체 기준(조회 시점, 스냅샷마다 ±1%p). 란록 처치 26.1% → 기숙사 우승컵 14.8%, 잔존 약 57% — 이야기를 끝까지 본 10명 중 4명이 마지막 컷신을 보지 못한다", 14, MUT)
s.save("fig-funnel.svg")

s = SVG(1600, 900)
thumb_frame(s, "DEEP DIVE · STEAM ACHIEVEMENT FUNNEL", "탐험 유도와 선택의 무게", "란록을 잡은 10명 중 4명은 왜 떠났나")
draw_funnel(s, 300, 270, 900, bar_h=46, gap=16, label_size=15)
s.save("thumb-deep-dive.svg")

# ---------------------------------------------------------------- 6. 도구 지급 리듬
s = SVG(1800, 520)
s.label(40, 48, "TOOL → GATE RHYTHM", ACC, 13)
s.text(40, 84, "게이트 직전에 지급되는 탐험 도구가 후반으로 갈수록 줄어든다", 24, TXT, weight=700)
segs = [("지도 내실까지", "레파로 · 인센디오 · 엑스펠리아르무스", 3, None), ("→ Lv12", "빗자루 · 필요의 방 · 핫스팟 · 글래시우스 · 디센도", 5, ("Lv12", "가을")),
        ("→ Lv19", "알로호모라 · 베틀 · 포획 자루 · 히포그리프 · 천문표 · 봄바르다 과제", 6, ("Lv19", "겨울")), ("→ Lv24", "변신 (신규 도구 감소)", 1, ("Lv24", "O.W.L.")),
        ("→ Lv34", "그래폰 탈것 외 없음", 0, ("Lv34", "에필로그"))]
x = 40
y = 150
widths = [260, 330, 420, 230, 300]
for (title, tools, n, gate), w in zip(segs, widths):
    # 막대 높이 = 도구 수
    h = 26 + n * 26
    s.add(f'<rect x="{x}" y="{330 - h}" width="{w - 70}" height="{h}" rx="10" fill="{ACC}" opacity="{0.25 + 0.12 * n if n else 0.12}"/>')
    s.text(x + (w - 70) / 2, 330 - h - 12, f"신규 도구 {n}종" if n else "신규 도구 0종", 14, TXT if n else RED, "middle", 700)
    s.text(x, 360, title, 15, TXT, weight=700)
    # 도구 목록 줄바꿈
    words = tools.split(" · ")
    lines_ = []
    cur = ""
    for wd in words:
        if len(cur) + len(wd) > 20:
            lines_.append(cur.rstrip(" ·")); cur = ""
        cur += wd + " · "
    lines_.append(cur.rstrip(" ·"))
    s.lines(x, 384, lines_, 12, MUT, 18)
    if gate:
        gx = x + w - 48
        s.diamond(gx, 300, 56, 56, gate[0], size=12)
        s.text(gx, 345, gate[1], 12, ACC3, "middle")
    x += w
s.text(40, 490, "Lv12→19는 7레벨 폭에 5–6종, Lv19→24는 5레벨 폭에 1–2종, Lv24→34는 10레벨 폭에 0–1종. 공백은 갈수록 넓어지는데 유도는 갈수록 약해진다", 14, MUT)
s.save("fig-tool-rhythm.svg")

# ---------------------------------------------------------------- 7. 선택 14개 효과
s = SVG(1800, 480)
s.label(40, 48, "14 MAJOR CHOICES · ACTUAL EFFECT", ACC, 13)
s.text(40, 84, "주요 선택 14개의 실제 효과", 24, TXT, weight=700)
parts = [("즉시 반응 · 무효", 7, DIM), ("능력 해금", 3, ACC2), ("콘텐츠 분기", 1, VIO), ("과정 차이", 1, VIO), ("결말 연출", 1, ACC3), ("결과 변화", 1, ACC)]
# 가로 적층 막대
x = 40; total = 14; W = 1720; y = 150; H = 70
for name, n, c in parts:
    w = W * n / total
    s.add(f'<rect x="{x}" y="{y}" width="{w-4}" height="{H}" rx="8" fill="{c}" opacity="{0.9 if c != DIM else 0.6}"/>')
    s.text(x + (w - 4) / 2, y + H / 2 + 7, f"{n}", 22, "#1a1718" if c in (ACC, ACC3, ACC2) else TXT, "middle", 800, mono=True)
    s.text(x + (w - 4) / 2, y + H + 26, name, 13, TXT, "middle", 600)
    x += w
# 설명 카드 3
cards = [("즉시 반응 · 무효 · 과정 차이  9", "대사·연출만 달라지고 도착점은 같다 — '결과는 레일 위'", DIM),
         ("능력 해금  3", "저주와 세바스찬처럼 무겁게 연출한 선택의 대가가 서사가 아니라 주문 목록으로 환산된다", ACC2),
         ("결과를 바꾸는 선택  1 (약 7%)", "세바스찬 고발 여부 — 게임에서 유일하게 결과가 갈리는 선택. 결말 선택은 컷신만 바꾼다", ACC)]
x = 40
for t, d, c in cards:
    s.box(x, 290, 556, 120, CARD, c, 14)
    s.text(x + 20, 326, t, 16, TXT, weight=700)
    # 간단 줄바꿈
    ws = d.split(" "); ln = []; cur = ""
    for wd in ws:
        if len(cur) + len(wd) > 34:
            ln.append(cur); cur = ""
        cur += wd + " "
    ln.append(cur)
    s.lines(x + 20, 354, ln, 13, MUT, 20)
    x += 580
s.save("fig-choices.svg")

# ---------------------------------------------------------------- 8. 재설계 전체 구조 (그림 + 썸네일)
def structure(s, ox, oy, compact=False):
    # 축 1
    s.box(ox, oy, 420, 150, CARD, VIO, 16)
    s.label(ox + 20, oy + 30, "AXIS 1", VIO, 11)
    s.text(ox + 20, oy + 60, "어둠의 흔적", 20, TXT, weight=700)
    s.text(ox + 20, oy + 90, "저주 실사용 기록 → 흔적 단계 0–3", 14, MUT)
    s.text(ox + 20, oy + 114, "속죄로 내려감 · 친구에게 쓴 기록은 영구", 14, MUT)
    # 축 2
    s.box(ox, oy + 190, 420, 150, CARD, ACC2, 16)
    s.label(ox + 20, oy + 220, "AXIS 2", ACC2, 11)
    s.text(ox + 20, oy + 250, "세바스찬 설득", 20, TXT, weight=700)
    s.text(ox + 20, oy + 280, "창구 W1–W4 + 보너스 + 신용 보정", 14, MUT)
    s.text(ox + 20, oy + 304, "6+ 구원 · 3–5 균열 · 2− 파국", 14, MUT)
    # 신용 보정 화살
    s.path(f"M {ox+210} {oy+150} L {ox+210} {oy+186}", VIO)
    s.text(ox + 222, oy + 174, "신용 보정 (0단계 +2 … 3단계 −5)", 12, VIO)
    # 질문
    qx, qy = ox + 640, oy + 170
    s.diamond(qx, qy, 300, 170, "피그의 질문", sub="마지막 보고 · 흔적 단계별 톤", stroke=ACC)
    s.path(f"M {ox+420} {oy+75} C {qx-200} {oy+75}, {qx-230} {qy}, {qx-150} {qy}", VIO)
    s.path(f"M {ox+420} {oy+265} C {qx-200} {oy+265}, {qx-230} {qy}, {qx-150} {qy}", ACC2)
    s.text(ox + 460, oy + 60, "질문 톤", 12, VIO)
    s.text(ox + 460, oy + 300, "결과 · 미결", 12, ACC2)
    # 축 3 결말
    ex = qx + 230
    endings = [("A+ 파수꾼", "봉인 + 0단계 + 구원", ACC), ("A 봉인", "봉인 + 조건 미충족", ACC), ("B 이사도라", "모두가 쓰게", ACC3), ("C 란록", "내가 쓴다", RED)]
    for i, (t, sub, c) in enumerate(endings):
        ey = oy - 10 + i * 92
        s.node(ex, ey, 260, 72, t, sub, stroke=c, size=17, subsize=12)
        s.path(f"M {qx+150} {qy} C {ex-60} {qy}, {ex-60} {ey+36}, {ex-4} {ey+36}", c)
    s.label(ex, oy - 24, "AXIS 3 · 세 갈래 선택 → 네 결말", ACC3, 11)
    # 포스트게임
    px = ex + 310
    s.box(px, oy + 20, 250, 300, CARD, LINE, 16)
    s.label(px + 20, oy + 50, "POST-GAME", ACC, 11)
    s.text(px + 20, oy + 82, "포스트게임 월드", 18, TXT, weight=700)
    s.lines(px + 20, oy + 120, ["파수꾼의 세계 — 임무 체인", "고통 수확의 세계 — 강화된 적", "두려움의 세계 — 권능 유적", "", "에필로그 슬롯 8개로 조립"], 13, MUT, 26)
    for i in range(4):
        ey = oy - 10 + i * 92 + 36
        s.arrow(ex + 260, ey, px - 4, oy + 170, DIM, head=False)

s = SVG(1800, 480)
s.label(40, 48, "REDESIGN STRUCTURE", ACC, 13)
s.text(40, 84, "세 축이 하나의 결말 구조로 모인다", 24, TXT, weight=700)
structure(s, 40, 130)
s.save("fig-redesign-structure.svg")

s = SVG(1600, 900)
thumb_frame(s, "REDESIGN PROPOSAL · ENDING BRANCHES", "엔딩 분기 재설계", "어둠의 흔적 · 세바스찬 설득 · 세 갈래 결말")
s.add('<g transform="translate(-10,270) scale(0.86)">')
structure(s, 100, 60)
s.add('</g>')
s.save("thumb-redesign.svg")

# ---------------------------------------------------------------- 9. 타임라인
s = SVG(1800, 460)
s.label(40, 48, "WHEN IS WHAT DECIDED", ACC, 13)
s.text(40, 84, "세바스찬 아크부터 피그의 질문까지의 판정 시점", 24, TXT, weight=700)
tl = [("천문학 수업 뒤", "세바스찬 아크 시작", LINE), ("연구의 그림자", "크루시오 학습", LINE), ("설득 창구 W1–W4", "발견 · 시간 · 거리 · 희망", ACC2),
      ("유물의 그림자", "세바스찬 판정 ◆", ACC), ("지팡이 숙련", "미결이면 오미니스 편지", LINE), ("지도 내실", "파수꾼 조언 · 피그와의 대화", LINE),
      ("마지막 보고 시작", "세바스찬 결과 확정", ACC2), ("피그의 질문", "결말 판정 ◆", ACC)]
bw, bh, gap = 190, 78, 30
x = 40; y = 180
for i, (t, sub, c) in enumerate(tl):
    s.node(x, y, bw, bh, t, sub, stroke=c, size=15, subsize=12)
    if i < len(tl) - 1:
        s.arrow(x + bw, y + bh / 2, x + bw + gap - 3, y + bh / 2, MUT)
    x += bw + gap
# 흔적 띠
s.add(f'<rect x="40" y="310" width="{x-70}" height="34" rx="17" fill="{VIO}" opacity="0.18"/>')
s.text(60, 333, "어둠의 흔적 — 게임 내내 쌓이고 속죄로 내려간다. 판정에 쓰이는 순간은 두 번 ◆ 유물의 그림자(설득 신용) · 피그의 질문(결말)", 14, VIO, weight=600)
s.path("M 740 310 L 740 262", VIO, dashed=True)
s.path("M 1620 310 L 1620 262", VIO, dashed=True)
s.text(40, 410, "솔로몬의 경고는 시간의 그림자(W2) 끝에 주인공에게 전해지고, 이후 목격된 저주 사용은 소문을 타고 위즐리 면담으로 이어진다", 14, MUT)
s.save("fig-redesign-timeline.svg")

# ---------------------------------------------------------------- 10. 흔적 단계
s = SVG(1800, 440)
s.label(40, 48, "DARK RESIDUE · TIERS", ACC, 13)
s.text(40, 84, "흔적 단계 0–3과 속죄로 내려가는 길", 24, TXT, weight=700)
tiers = [("0 · 깨끗함", "0점", "설득 신용 +2 · 진엔딩 조건", ACC), ("1 · 그림자", "1–19점", "동료의 걱정 · 위즐리 면담", ACC2), ("2 · 얼룩", "20–79점", "산 바카르의 경계 · 흔들리는 봉인", ACC3), ("3 · 물듦", "80점 이상", "구원 불가 · 붉은 눈 잔상", RED)]
x = 60; y = 160; r = 62
cx_list = []
for i, (t, pts, eff, c) in enumerate(tiers):
    cx = x + i * 440 + r
    cx_list.append(cx)
    s.add(f'<circle cx="{cx}" cy="{y+r}" r="{r}" fill="{CARD}" stroke="{c}" stroke-width="3"/>')
    s.text(cx, y + r - 4, t.split(" · ")[0], 26, c, "middle", 800, mono=True)
    s.text(cx, y + r + 22, t.split(" · ")[1], 14, TXT, "middle", 700)
    s.text(cx, y + 2 * r + 30, pts, 13, MUT, "middle", mono=True)
    s.text(cx, y + 2 * r + 54, eff, 13, MUT, "middle")
for i in range(3):
    a, b = cx_list[i] + r, cx_list[i + 1] - r
    s.arrow(a + 6, y + r - 16, b - 6, y + r - 16, TXT)
    s.text((a + b) / 2, y + r - 26, ["저주 사용", "누적 20", "누적 80"][i], 12, TXT, "middle")
    s.arrow(b - 6, y + r + 20, a + 6, y + r + 20, ACC, dashed=True)
    s.text((a + b) / 2, y + r + 42, "버팀 — 퀘스트 점수 2점", 12, ACC, "middle")
s.text(40, 370, "실선은 사용으로 오르는 길, 점선은 마지막 사용 뒤 퀘스트 점수 2점(메인 1 · 사이드·관계 0.5)을 버텨 내려가는 길. 횟수 제한 없음", 14, MUT)
s.text(40, 396, "친구에게 쓴 저주(세바스찬에게 크루시오, 오미니스에게 임페리오)는 영구 기록 — 1단계가 바닥이 되어 0단계로 돌아갈 수 없다", 14, MUT)
s.save("fig-redesign-residue.svg")

# ---------------------------------------------------------------- 11. 감도 분석
s = SVG(1800, 560)
s.label(40, 48, "SENSITIVITY · 200,000 SIMULATED PLAYERS · BASE SCENARIO", ACC, 13)
s.text(40, 84, "기준점 4안의 구원 · 균열 · 파국 비율 (기준 시나리오)", 24, TXT, weight=700)
rows = [("A 기존", "기준점 7 · 균열 4–6 · 3단계 −4", (18, 19, 62), False), ("B", "기준점 6 · 균열 4–5 · 3단계 −5", (24, 14, 63), False),
        ("C", "기준점 7 · 균열 3–6 · 3단계 −4", (18, 26, 55), False), ("D 채택", "기준점 6 · 균열 3–5 · 3단계 −5", (24, 20, 56), True)]
W = 1120; x0 = 420; y = 150; H = 54; gap = 24
for name, desc, (rd, fr, dm), pick in rows:
    s.text(x0 - 20, y + 22, name, 18, ACC if pick else TXT, "end", 800)
    s.text(x0 - 20, y + 44, desc, 12, MUT, "end")
    x = x0
    for v, c, lab in ((rd, ACC, "구원"), (fr, ACC3, "균열"), (dm, RED, "파국")):
        w = W * v / 100
        s.add(f'<rect x="{x}" y="{y}" width="{w-3}" height="{H}" rx="6" fill="{c}" opacity="{0.95 if pick else 0.5}"/>')
        s.text(x + (w - 3) / 2, y + H / 2 + 7, f"{v}%", 17, "#1a1718", "middle", 800, mono=True)
        x += w
    if pick:
        s.add(f'<rect x="{x0-6}" y="{y-6}" width="{W+12}" height="{H+12}" rx="10" fill="none" stroke="{ACC}" stroke-width="2"/>')
    y += H + gap
# 범례
lx = x0; ly = y + 10
for c, lab in ((ACC, "구원 — 세바스찬이 지팡이를 내림"), (ACC3, "균열 — 살인을 막지만 앤이 거리를 둠"), (RED, "파국 — 원작 루트, 솔로몬 사망")):
    s.add(f'<rect x="{lx}" y="{ly}" width="16" height="16" rx="4" fill="{c}"/>')
    s.text(lx + 24, ly + 13, lab, 13, MUT)
    lx += 380
s.text(40, 536, "G3 목표: 유물의 그림자 도달자 중 구원 20–40%. 파국 비율은 구원 기준점이 아니라 균열 하한이 정한다 — 기준점만 낮추면(B) 균열이 줄어들 뿐 파국은 그대로다", 14, MUT)
s.save("fig-redesign-sensitivity.svg")

# ---------------------------------------------------------------- 12. 소개 과정 그림
s = SVG(1600, 900)
s.add('<rect width="1600" height="900" fill="#2a2627"/>')
for gx in range(0, 1600, 48):
    for gy in range(0, 900, 48):
        s.add(f'<circle cx="{gx}" cy="{gy}" r="1.3" fill="{ACC}" opacity="0.07"/>')
steps = [("01", "분해", "역기획", "퀘스트 · 시스템 · UI · 시나리오를\n공통 기준으로 분해", ACC), ("02", "진단", "심층 분석", "업적 통계 · 선택지 전수조사로\n작동하는 곳과 무너지는 곳을 찾기", ACC2), ("03", "제안", "재설계 제안", "시스템 · 내러티브 설계,\n검산과 시뮬레이션으로 수치 결정", ACC3)]
for i, (n, t, sub, desc, c) in enumerate(steps):
    x = 110 + i * 470
    s.box(x, 240, 400, 420, "#231f20", c, 24, 2)
    s.text(x + 40, 320, n, 54, c, weight=800, mono=True)
    s.text(x + 40, 390, t, 44, TXT, weight=800)
    s.text(x + 40, 430, sub, 20, c, weight=600)
    s.lines(x + 40, 500, desc.split("\n"), 19, MUT, 32)
    if i < 2:
        s.arrow(x + 400 + 14, 450, x + 470 - 14, 450, ACC, sw=3)
s.text(800, 760, "한 게임을 끝까지 따라간다 — 결론만 읽으려면 각 문서의 '한눈에 보기'", 20, MUT, "middle")
s.save("process.svg")

# ---------------------------------------------------------------- 13. 상세 페이지 상단 배너 (제목 없이 그림만, 1800×600)
def hero_frame(s):
    s.add(f'<rect width="{s.w}" height="{s.h}" fill="url(#hg)"/>')
    s.parts.insert(2, '<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#231f20"/><stop offset="1" stop-color="#15181a"/></linearGradient></defs>')
    for gx in range(0, s.w, 48):
        for gy in range(0, s.h, 48):
            s.add(f'<circle cx="{gx}" cy="{gy}" r="1.3" fill="{ACC}" opacity="0.08"/>')

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
chapter_flow(s, 60, 250, 1.0)
s.add('</g>')
s.save("hero-reverse.svg")

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
draw_funnel(s, 420, 40, 1000, bar_h=38, gap=20, label_size=14)
s.add('</g>')
s.save("hero-deep-dive.svg")

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
structure(s, 120, 150)
s.add('</g>')
s.save("hero-redesign.svg")
