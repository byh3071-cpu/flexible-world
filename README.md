# Flexible-World

> 실존주의(Existentialism)가 동작하는 디지털 사회 — *"실존은 본질에 앞선다"*

HTML5 + Vanilla JS (ES6 Modules) + Phaser 3 + Firebase Realtime Database로 만드는 **2D 픽셀 멀티플레이 샌드박스 커뮤니티 월드**.

> *"신은 시나리오를 쓰지 않았다. 당신은 이유 없이 이 세계에 던져졌을 뿐."*

---

## 🏛️ 철학 (4개 절대 원칙)

1. **이신론적 신** — 사회적 규칙·법·처벌을 코딩하지 않는다. 오직 물리 법칙과 도구만 창조한다.
2. **스스로 증명하라** — 정해진 직업은 없다. 칼을 들면 전사, 물건을 팔면 상인. 인벤토리 = 본질.
3. **강제 없는 책임** — Safe Zone·Admin·Auto-Moderation 없음. 유저가 직접 벽을 쌓고 평판으로 통제.
4. **피투성(Thrownness)** — 튜토리얼 없음. 검은 화면 → 랜덤 스폰 → 즉시 생존.

상세: [`CLAUDE.md`](./CLAUDE.md) · [`docs/SPEC.md`](./docs/SPEC.md) · [노션 「플렉시블 월드 본질」](https://www.notion.so/3009740ab072806d9275cbf2842facd2)

---

## 🚀 실행

```bash
# 로컬 서버 (빌드 도구 없음. 정적 파일만)
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 🧪 테스트

```bash
node --test tests/*.test.mjs
```

Node 22+ native test runner. 의존성 0개. 순수 함수 단위 테스트만 (현재 16개, OfflineSystem.calculateCatchUp).

---

## 📂 구조

자세한 구조는 [`CLAUDE.md` §3](./CLAUDE.md#3-️-기술적-제약-technical-constraints) 참고. 핵심:

- `js/MainScene.js` — Phaser 메인 씬 (분해 진행 중)
- `js/systems/` — 순수 계산 + 부수효과 클래스 패턴
- `js/config/balance.js` — 모든 밸런스 상수
- `docs/ADR/` — 주요 설계 결정 기록

---

## 📝 작업 흐름

- 개발 브랜치: `claude/<작업명>`
- 변경 시 [`docs/DEV_LOG.md`](./docs/DEV_LOG.md) 상단에 1줄 이상 기록.
- 설계 결정은 [`docs/ADR/`](./docs/ADR/) 에 ADR-NNNN 형식으로.

PR 머지 게이트는 [`CLAUDE.md` §4-3](./CLAUDE.md) 참고.

---

## 🔗 외부 SoT

이 저장소의 비전·철학·서사 원문은 [노션 「플렉시블 월드 본질」](https://www.notion.so/3009740ab072806d9275cbf2842facd2)이 단일 진리원(SoT). `docs/SPEC.md`는 그 미러.

---

*"이 게임은 너에게 자유를 준다. 그 자유로 무엇을 할지는 너의 선택이다."*
