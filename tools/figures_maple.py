"""메이플스토리 '길잡이 동행' 기획서의 그림·썸네일·배너 SVG를 생성합니다.
사용: python3 tools/figures_maple.py public/images
figures.py 의 SVG 도우미(색·글꼴·도형)를 그대로 가져와 같은 스타일로 그립니다.
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, "figures.py"), encoding="utf-8").read()
exec(_src.split("# ---------------------------------------------------------------- 1.")[0])  # SVG, thumb_frame, 색 상수

OUT_MAPLE = os.path.join(OUT, "maple")
os.makedirs(OUT_MAPLE, exist_ok=True)


def hero_frame(s):
    s.add(f'<rect width="{s.w}" height="{s.h}" fill="url(#hg)"/>')
    s.parts.insert(2, '<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#231f20"/><stop offset="1" stop-color="#15181a"/></linearGradient></defs>')
    for gx in range(0, s.w, 48):
        for gy in range(0, s.h, 48):
            s.add(f'<circle cx="{gx}" cy="{gy}" r="1.3" fill="{ACC}" opacity="0.08"/>')


def save_to(s, sub, name):
    """OUT 바깥의 하위 폴더에 저장."""
    global OUT
    keep = OUT
    OUT = sub
    s.save(name)
    OUT = keep


# ---------------------------------------------------------------- 핵심 루프
def loop(s, ox, oy, k=1.0, compact=False):
    """인연 맺기 → 주간 루프 ×12 → 졸업 조건? → 졸업 원정 3막 → 기록, 다음 시즌으로 돌아가는 고리."""
    def X(v):
        return ox + v * k

    def Y(v):
        return oy + v * k

    f = lambda v: v * k  # noqa: E731
    # 1. 인연 맺기
    s.node(X(0), Y(150), f(200), f(90), "인연 맺기", "상시 매칭 · 계정 단위 자격", stroke=ACC, size=f(19), subsize=f(13), r=f(14))
    # 2. 주간 루프 상자
    s.box(X(260), Y(40), f(520), f(310), CARD2, LINE, f(18))
    s.label(X(284), Y(74), "WEEKLY LOOP × 12", ACC, f(12))
    s.text(X(284), Y(110), "주간 루프", f(22), TXT, weight=800)
    s.text(X(400), Y(110), "매주 목요일 초기화 · 추가 플레이 제자 20–25분, 스승 15–20분", f(12), MUT)
    items = [("성장 과제 3개", "제자 혼자, 평소 플레이로", ACC2), ("배움 과제 1개", "튜토리얼형 · 스승이 고르고 승인", VIO), ("2인 원정 1회", "15분 · 파수꾼 + 탐험가", ACC)]
    for i, (t, sub, c) in enumerate(items):
        y = Y(136 + i * 68)
        s.node(X(284), y, f(472), f(56), t, sub, fill=CARD, stroke=c, size=f(16), subsize=f(12), r=f(12))
    s.arrow(X(200), Y(195), X(260 - 6), Y(195), ACC, sw=f(2))
    # 3. 졸업 조건?
    s.diamond(X(880), Y(195), f(170), f(110), "졸업 조건", stroke=ACC3, size=f(16), sub="트랙별 · 원정 10회")
    s.arrow(X(780), Y(195), X(880 - 85 - 6), Y(195), MUT, sw=f(2))
    # 아니오: 위로 돌아가는 고리
    s.path(f"M {X(880)} {Y(140)} L {X(880)} {Y(10)} L {X(520)} {Y(10)} L {X(520)} {Y(40 - 6)}", MUT, dashed=True, sw=f(2))
    s.text(X(700), Y(2), "아니오 → 다음 주", f(12), MUT, "middle")
    # 4. 졸업 원정 3막
    s.node(X(1010), Y(150), f(250), f(90), "졸업 원정 3막", "역할 반전 · 스승의 시험 · 졸업식", stroke=ACC3, size=f(18), subsize=f(12), r=f(14))
    s.arrow(X(880 + 85), Y(195), X(1010 - 6), Y(195), ACC3, sw=f(2))
    s.text(X(950), Y(180), "예", f(12), ACC3, "middle", 700)
    # 5. 남는 것
    s.node(X(1010), Y(290), f(250), f(96), "스승: 코인 + 훈장 기록", "제자: 다음 시즌 등반 트랙 → 스승", fill=CARD2, stroke=ACC, size=f(15), subsize=f(12), r=f(14))
    s.arrow(X(1135), Y(240), X(1135), Y(290 - 6), ACC, sw=f(2))
    # 다음 시즌 → 인연 맺기 (아래로 돌아가는 점선)
    s.path(f"M {X(1135)} {Y(386)} L {X(1135)} {Y(430)} L {X(100)} {Y(430)} L {X(100)} {Y(240 + 6)}", ACC, dashed=True, sw=f(2))
    s.text(X(620), Y(452), "다음 시즌 — 졸업한 제자가 스승이 되거나, 스승이 다음 제자를 받음", f(12), ACC, "middle")


s = SVG(1600, 600)
s.text(40, 50, "길잡이 동행 — 핵심 루프", 24, TXT, weight=700)
s.text(40, 78, "한 쌍이 12주 동안 매주 세 가지를 하고, 졸업 조건을 채우면 졸업 원정으로 끝난다. 스승의 보상은 제자의 성장에만 걸린다.", 14, MUT)
loop(s, 170, 108, 1.0)
save_to(s, OUT_MAPLE, "fig-maple-loop.svg")

# ---------------------------------------------------------------- 썸네일 · 기획서
s = SVG(1600, 900)
thumb_frame(s, "CONTENT PROPOSAL · MAPLESTORY", "길잡이 동행 콘텐츠 기획서", "스승 1 · 제자 1 · 주 1회 15분 원정 — 관계로 굴러가는 콘텐츠")
s.add('<g opacity="0.95">')
loop(s, 130, 300, 1.0)
s.add('</g>')
s.save("thumb-maple-companion.svg")

# ---------------------------------------------------------------- 배너 · 기획서
s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
loop(s, 330, 24, 0.9)
s.add('</g>')
s.save("hero-maple-companion.svg")


# ---------------------------------------------------------------- 상세 설계: 세 스테이지 + 리듬 레인
def stages(s, ox, oy, k=1.0):
    def X(v):
        return ox + v * k

    def Y(v):
        return oy + v * k

    f = lambda v: v * k  # noqa: E731
    st = [("1. 숲길", "4분 · 등불 5개 회수", "제자가 등불을 들고, 스승이 결박으로 지킨다", ACC2),
          ("2. 바람 다리", "4분 · 4구간", "바람 3초 전 방패, 지나가면 질주", VIO),
          ("3. 하늘 제단", "6분 · 수호자", "선창 → 응답(스승) → 마무리(제자), 등불 5개 = 5단계", ACC)]
    for i, (t, sub, desc, c) in enumerate(st):
        x = X(i * 420)
        s.box(x, Y(0), f(380), f(150), CARD, c, f(16), 2)
        s.text(x + f(24), Y(44), t, f(22), TXT, weight=800)
        s.text(x + f(24), Y(72), sub, f(13), c, weight=600)
        s.text(x + f(24), Y(104), desc, f(13), MUT)
        if i < 2:
            s.arrow(x + f(380) + f(10), Y(75), x + f(420) - f(10), Y(75), MUT, sw=f(2))
    # 리듬 레인
    ly = Y(210)
    s.box(X(0), ly, f(1220), f(96), CARD2, LINE, f(14))
    s.label(X(24), ly + f(30), "GUARDIAN · CALL AND RESPONSE", ACC, f(11))
    s.add(f'<line x1="{X(40)}" y1="{ly + f(66)}" x2="{X(1190)}" y2="{ly + f(66)}" stroke="{LINE}" stroke-width="{f(2)}"/>')
    s.add(f'<line x1="{X(70)}" y1="{ly + f(44)}" x2="{X(70)}" y2="{ly + f(88)}" stroke="{ACC3}" stroke-width="{f(3)}"/>')
    notes = [("Z", "#5b8def"), ("X", ACC3), ("→", MUT), ("C", ACC), ("Z", "#5b8def"), ("↑", MUT), ("X", ACC3)]
    for i, (lab, c) in enumerate(notes):
        cx = X(150 + i * 150)
        s.add(f'<circle cx="{cx}" cy="{ly + f(66)}" r="{f(16)}" fill="{c}" opacity="0.92"/>')
        s.text(cx, ly + f(66) + f(5), lab, f(13), "#1a1718", "middle", 800, mono=True)
    s.text(X(1190), ly + f(36), "판정선 ←  PERFECT ±0.1초 · GOOD ±0.2초 · MISS 는 시간만 잃음", f(12), MUT, "end")


s = SVG(1600, 900)
thumb_frame(s, "DETAIL SPEC · MAPLESTORY", "길잡이 동행 상세 설계", "던전 화면 · 수호자 · 리듬 전투 · 졸업식 대본 · 배움 과제 풀")
s.add('<g opacity="0.95">')
stages(s, 190, 320, 1.0)
s.add('</g>')
s.save("thumb-maple-detail.svg")

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
stages(s, 290, 70, 1.0)
s.add('</g>')
s.save("hero-maple-detail.svg")


# ================================================================ 심층 분석 그림
# ---------------------------------------------------------------- 사례 7건 계보 (카드 흐름)
def lineage(s, ox, oy, w=1360, k=1.0):
    f = lambda v: v * k  # noqa: E731
    items = [
        ("2008 – 2014", "메이플 패밀리", "엘더 1 · 주니어 2 가계도. 주니어 활동량이 엘더의 버프 재료", "다단계형 버프 농장 → 2014 길드 개편 때 삭제", True),
        ("2016 –", "FFXIV 멘토", "자격 인증형. 던전 1,000회 · 추천 1,500회가 조건", "가르침이 시스템에 있는 드문 사례, 대신 멘토 수가 적음", False),
        ("2025-01 –", "TMS 사제 시스템", "스승 1 · 제자 1. 각자의 활동량 1,000점이면 셋이 보상 공유", "숙련자 3인 닫힌 고리. '같이 하는 콘텐츠'가 없음", True),
        ("2025-03 –", "검은사막 멘토&멘티", "쿠폰형. 멘티의 성장 단계 달성이 양쪽 보상", "보상이 커서 부계정 멘티가 합리적 선택이 됨", False),
        ("2025-12 – 26-04", "KMS 챌린저스 파트너", "대등 1:1 · 해지 불가. 2인 하드 보스 격파가 미션", "스펙이 맞아야 해 신규 배제. 시즌4에는 미시행", True),
        ("2026-08 –", "MSEA 멘토십", "TMS 사제 이식. 제자가 있어야 랭킹 등록", "진짜 신규를 시스템이 못 가려 운영 이벤트로 보완", True),
    ]
    cols, gapx, gapy = 3, f(28), f(26)
    cw = (w - gapx * (cols - 1)) / cols
    ch = f(132)
    for i, (yr, name, how, what, maple) in enumerate(items):
        r, c = divmod(i, cols)
        x = ox + c * (cw + gapx)
        y = oy + r * (ch + gapy)
        col = ACC if maple else LINE
        s.box(x, y, cw, ch, CARD, col, f(14), 2 if maple else 1.5)
        s.text(x + f(20), y + f(30), yr, f(12), ACC if maple else MUT, mono=True, style='letter-spacing="1"')
        s.text(x + f(20), y + f(58), name, f(18), TXT, weight=800)
        s.text(x + f(20), y + f(86), how, f(12), MUT)
        s.text(x + f(20), y + f(110), "→ " + what, f(12), ACC3 if maple else DIM)
        if c < cols - 1:
            s.arrow(x + cw + f(6), y + ch / 2, x + cw + gapx - f(6), y + ch / 2, DIM, sw=f(1.5))
    # 행 사이 연결
    s.path(f"M {ox + w} {oy + ch / 2 + f(10)} L {ox + w + f(14)} {oy + ch / 2 + f(10)} L {ox + w + f(14)} {oy + ch + gapy / 2} L {ox - f(14)} {oy + ch + gapy / 2} L {ox - f(14)} {oy + ch + gapy + ch / 2 - f(10)} L {ox} {oy + ch + gapy + ch / 2 - f(10)}", DIM, dashed=True, sw=f(1.5))
    ly = oy + 2 * ch + gapy + f(30)
    s.add(f'<rect x="{ox}" y="{ly - f(6)}" width="{f(14)}" height="{f(14)}" rx="3" fill="none" stroke="{ACC}" stroke-width="2"/>')
    s.text(ox + f(22), ly + f(5), "메이플스토리 — 같은 자리를 세 번 채우고도 매번 같은 문제를 다른 모양으로 겪었다", f(13), MUT)


s = SVG(1600, 480)
s.text(40, 50, "사제·멘토링 사례 6건의 계보", 24, TXT, weight=700)
s.text(40, 78, "숙련 유저와 비숙련 유저를 연결해 양쪽에 보상을 주는 시스템. 2008년부터 2026년까지, 메이플 안팎.", 14, MUT)
lineage(s, 120, 110, 1360)
save_to(s, OUT_MAPLE, "fig-maple-lineage.svg")

s = SVG(1600, 900)
thumb_frame(s, "DEEP DIVE · MENTORSHIP SYSTEMS", "사제·멘토링 시스템 심층 분석", "같은 자리를 세 번 채운 메이플, 사례 7건이 가리키는 한 가지 규칙")
s.add('<g opacity="0.95">')
lineage(s, 130, 300, 1340)
s.add('</g>')
s.save("thumb-maple-mentorship.svg")

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
lineage(s, 220, 40, 1360, 0.95)
s.add('</g>')
s.save("hero-maple-mentorship.svg")


# ---------------------------------------------------------------- 보스 1인 격파 업적률 (가로 막대)
def boss_rates(s, ox, oy, w=1100):
    rows = [("노멀 세렌", 5.39, 95, False), ("이지 칼로스", 4.72, 83, False), ("이지 최초의 대적자", 4.24, 75, False),
            ("하드 세렌", 3.59, 63, True), ("노멀 칼로스", 1.94, 34, True), ("노멀 최초의 대적자", 1.92, 34, False),
            ("카오스 칼로스", 0.29, 5, False), ("하드 최초의 대적자", 0.15, 3, False), ("익스트림 세렌", 0.10, 2, False)]
    label_w = 190
    bar_x = ox + label_w
    bar_w = w - label_w - 560
    h, gap = 30, 12
    vmax = 6.0
    for i, (name, rate, act, pick) in enumerate(rows):
        y = oy + i * (h + gap)
        s.text(bar_x - 14, y + h / 2 + 5, name, 14, TXT if pick else MUT, "end", 700 if pick else 400)
        bw = max(4, bar_w * rate / vmax)
        c = ACC if pick else ACC2
        s.add(f'<rect x="{bar_x}" y="{y}" width="{bw}" height="{h}" rx="4" fill="{c}" opacity="{1 if pick else 0.45}"/>')
        s.text(bar_x + bw + 10, y + h / 2 + 5, f"{rate:.2f}%", 13, TXT if pick else MUT, "start", 700 if pick else 400, mono=True)
        s.text(bar_x + bw + 80, y + h / 2 + 5, f"액티브 약 {act}%", 12, ACC if pick else DIM, "start")
    # 기준선 구간 표시
    y_top = oy + 3 * (h + gap) - 6
    y_bot = oy + 5 * (h + gap) - gap + 6
    s.add(f'<rect x="{bar_x - 4}" y="{y_top}" width="{bar_w + 4}" height="{y_bot - y_top}" rx="8" fill="none" stroke="{ACC3}" stroke-width="1.5" stroke-dasharray="6 5"/>')
    ax = bar_x + bar_w + 190
    s.text(ax, y_top + 22, "넥슨이 그은 기준선", 13, ACC3, "start", 700)
    s.text(ax, y_top + 42, "유니온 챔피언 SS = 하드 세렌 솔격, SSS = 노멀 칼로스 솔격", 12, ACC3)
    s.text(ax, y_top + 60, "보스 결정 가격이 꺾이는 자리 = 하드 세렌 ↔ 이지 카링 (2025-10 메이플 나우)", 12, ACC3)
    s.text(ax, y_top + 78, "최초의 대적자 설계 눈금: 이지 = 이지 칼로스~하드 세렌, 노멀 = 노멀 칼로스~익스 스우", 12, ACC3)
    s.text(bar_x, oy + 9 * (h + gap) + 8, "1인 격파 업적 달성률 (전체 메이플ID 기준, 2026-08-12 · 대적자는 10-08) · '액티브 약 N%'는 액티브 34만 명으로 환산한 추정", 12, DIM)
    s.text(bar_x, oy + 9 * (h + gap) + 26, "이지 카링은 2026년 솔로 업적률 미확인 — 액티브 평균 스펙이 이지 카링 최소컷 수준이라는 위키 서술만 있음", 12, DIM)


s = SVG(1600, 520)
s.text(40, 50, "보스 1인 격파 인구 — 스승 허들은 '평균 유저가 도달하는 선'에 있다", 24, TXT, weight=700)
s.text(40, 78, "하드 세렌 솔격은 액티브의 약 63%, 노멀 칼로스는 약 34%. 카오스 칼로스부터 5% 아래로 급감해 여기가 진짜 상위 구간이다.", 14, MUT)
boss_rates(s, 60, 110, 1480)
save_to(s, OUT_MAPLE, "fig-maple-boss-rates.svg")


# ---------------------------------------------------------------- 시즌 주기와 이탈 곡선
def churn_curve(s, ox, oy, w=1380, h=300):
    # x: 주 차 0~26, y: 피크 대비 활동량 0~100
    def X(wk):
        return ox + wk / 26 * w
    def Y(v):
        return oy + h - v / 100 * h
    # 격자
    for v in (0, 25, 50, 75, 100):
        s.add(f'<line x1="{ox}" y1="{Y(v)}" x2="{ox + w}" y2="{Y(v)}" stroke="{LINE}" stroke-width="1"/>')
        s.text(ox - 10, Y(v) + 4, f"{v}%", 12, DIM, "end", mono=True)
    for wk in range(0, 27, 2):
        s.text(X(wk), oy + h + 22, f"{wk}주", 11, DIM, "middle", mono=True)
    # 이탈 구간 8~14주
    s.add(f'<rect x="{X(8)}" y="{oy}" width="{X(14) - X(8)}" height="{h}" fill="{ACC3}" opacity="0.10"/>')
    s.text((X(8) + X(14)) / 2, oy + 18, "이탈 구간 8–14주", 13, ACC3, "middle", 700)
    s.text((X(8) + X(14)) / 2, oy + 36, "피크 대비 50% → 35%", 12, ACC3, "middle")
    # 곡선 (두 사례 평균, 선형 보간)
    pts = [(0, 100), (2, 80), (4.5, 65), (8.5, 50), (13, 35)]
    d = "M " + " L ".join(f"{X(a)} {Y(b)}" for a, b in pts)
    s.add(f'<path d="{d}" fill="none" stroke="{ACC}" stroke-width="2.5" stroke-linejoin="round"/>')
    s.add(f'<path d="M {X(13)} {Y(35)} L {X(26)} {Y(35)}" fill="none" stroke="{ACC}" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>')
    for a, b in pts:
        s.add(f'<circle cx="{X(a)}" cy="{Y(b)}" r="5" fill="{ACC}" stroke="{BG}" stroke-width="2"/>')
    s.text(X(0) + 8, Y(100) - 10, "100% 시즌 시작(여름·겨울 대형 업데이트)", 12, MUT)
    s.text(X(13) + 8, Y(35) - 10, "잔류 유저만 남음 · 시즌4는 13주에 종료", 12, MUT)
    # 다음 시즌
    s.add(f'<line x1="{X(26)}" y1="{oy}" x2="{X(26)}" y2="{oy + h}" stroke="{ACC}" stroke-width="2"/>')
    s.text(X(26) - 8, oy + 18, "다음 시즌 시작 (26주 = 182일 주기)", 12, ACC, "end", 700)
    # 사전 리프 마커
    for wk, lab in ((4.5, "1차 사전 리프"), (8.5, "2차 사전 리프")):
        s.add(f'<line x1="{X(wk)}" y1="{oy + h}" x2="{X(wk)}" y2="{oy + h - 14}" stroke="{VIO}" stroke-width="2"/>')
        s.text(X(wk), oy + h - 20, lab, 11, VIO, "middle")
    # 84일 화살표
    yy = oy + h - 60
    s.arrow(X(14), yy, X(26) - 4, yy, ACC3, sw=2)
    s.text((X(14) + X(26)) / 2, yy - 10, "14주 차 이탈자가 다음 시즌까지 쉬는 기간 = 84일 (12주) → 복귀 기준", 12, ACC3, "middle", 700)
    s.text(ox, oy + h + 46, "출처: 2023-12→2024-04, 2025-06 PC방 점유율 보도 4건을 보간한 추정. 넥슨 내부 동접 데이터가 아니며 PC방 이용자는 전체의 일부", 12, DIM)


s = SVG(1600, 480)
s.text(40, 50, "시즌 주기와 이탈 곡선 — 복귀 기준 84일이 나온 자리", 24, TXT, weight=700)
s.text(40, 78, "시즌 시작은 12/19 → 6/19 → 12/18 → 6/18로 182일 주기. 8–14주 차에 떠난 유저를 전부 포함하려면 90일이 아니라 84일이어야 한다.", 14, MUT)
churn_curve(s, 120, 110, 1420, 280)
save_to(s, OUT_MAPLE, "fig-maple-churn-curve.svg")


# ---------------------------------------------------------------- 빈틈 그림: 시간을 줄인 KMS, 이유를 더한 해외
def gap(s, ox, oy, k=1.0):
    f = lambda v: v * k  # noqa: E731
    cols = [
        ("KMS", "시간을 줄였다", ACC2, ["보스 시간·체력 3분의 2", "일일 퀘스트 100마리로 통일", "시너지 조정 → 솔로 기본", "퍼스널 버닝 — 내 캐릭터 기준 미션", "모바일 자동 사냥 · 방치형 미니게임"]),
        ("GMS · 해외 서버", "이유를 더했다", ACC3, ["GMS: 독자 직업 · 플레이어블 서사", "GMS: 파괴 0% 강화 · 랭크형 축제", "TMS: 사제 시스템 · 홍월의 숲", "TMS: 빅토리아컵 월드 협동", "CMS·GMS: 클래식 서버"]),
    ]
    cw, ch = f(500), f(300)
    for i, (title, verb, c, lines) in enumerate(cols):
        x = ox + i * (cw + f(260))
        s.box(x, oy, cw, ch, CARD, c, f(18), 2)
        s.text(x + f(28), oy + f(44), title, f(22), TXT, weight=800)
        s.text(x + f(28), oy + f(72), verb, f(15), c, weight=700)
        for j, l in enumerate(lines):
            s.text(x + f(28), oy + f(110) + j * f(34), "· " + l, f(14), MUT)
    # 가운데 빈틈
    mx = ox + cw + f(130)
    my = oy + ch / 2
    s.arrow(ox + cw + f(10), my, mx - f(96), my, ACC2, sw=f(2))
    s.arrow(ox + cw + f(260) - f(10), my, mx + f(96), my, ACC3, sw=f(2))
    s.diamond(mx, my, f(190), f(150), "비는 자리", stroke=ACC, size=f(16), sub="둘 다 다루지 않은 것")
    s.text(mx, oy + ch + f(40), "줄어든 시간에, 함께할 이유", f(20), ACC, "middle", 800)
    s.text(mx, oy + ch + f(66), "짧고(15분) · 내 수준에서 출발하고 · 조작이 결과를 가르며 · 함께할 이유가 스펙과 무관한 콘텐츠", f(13), MUT, "middle")


s = SVG(1600, 520)
s.text(40, 50, "KMS는 시간을 줄였고, 해외 서버는 이유를 더했다", 24, TXT, weight=700)
s.text(40, 78, "같은 본편을 쓰는 서버들이 2025–2026년에 다르게 고친 것. 두 방향이 겹치지 않는 자리가 신규 콘텐츠의 자리다.", 14, MUT)
gap(s, 170, 110, 1.0)
save_to(s, OUT_MAPLE, "fig-maple-gap.svg")

s = SVG(1600, 900)
thumb_frame(s, "DEEP DIVE · MARKET GAP 2025–26", "KMS·GMS·해외 서버 동향과 빈틈", "시간을 줄인 KMS, 이유를 더한 해외 — 후보 7개에서 하나를 고르기까지")
s.add('<g opacity="0.95">')
gap(s, 170, 320, 0.95)
s.add('</g>')
s.save("thumb-maple-gap.svg")

s = SVG(1800, 600)
hero_frame(s)
s.add('<g opacity="0.9">')
gap(s, 290, 50, 0.95)
s.add('</g>')
s.save("hero-maple-gap.svg")
