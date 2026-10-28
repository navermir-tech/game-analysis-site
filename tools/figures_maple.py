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
