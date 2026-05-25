# CLAUDE.md — Flexible-World

> **Project**: Flexible-World (The World of Thrownness)
> **Vision**: 실존주의(Existentialism)가 동작하는 디지털 사회 — "실존은 본질에 앞선다"
> **Stack**: HTML5 / Vanilla JS (ES6 Modules) / Phaser 3 / Firebase Realtime DB
> **Current Version**: V18 (환경·날씨)
> **SoT (Single Source of Truth)**: Notion 「플렉시블 월드 본질」 — 이 파일은 그 미러

---

## 0. 🚨 작업 시작 전 필독 (Pre-flight)

1. **모드 명시** — 답변 첫 줄에 `[현재 모드: 🚑 필드 메딕]` 처럼 작성 중인 에이전트를 선언한다.
2. **철학 검증** — 새 기능 작성 전에 §1 「철학 헌장」을 한 번 더 읽고, 위반 여부를 자가 점검한다.
3. **변경 기록** — 의미 있는 변경은 `docs/DEV_LOG.md`에 1줄 이상 남긴다.
4. **상수 위치** — 모든 밸런스 상수는 `js/config/balance.js`로 (Phase B 이후). 코드 상단 매직 넘버 금지.
5. **노션 동기화** — 비전·기획 변경은 노션 SoT를 먼저 수정하고, `docs/SPEC.md`에 미러한다.

---

## 1. 🏛️ 철학 헌장 (The Constitution)

모든 에이전트는 아래 원칙을 **절대적**으로 준수한다. 위반 코드는 **머지 차단** 사유다.

### 1-1. 개발자의 역할 — 이신론적 신 (Deistic God)
- ❌ 사회적 규칙·법·처벌을 직접 코딩하지 않는다.
- ✅ 오직 **물리 법칙(Physics)** 과 **도구(Tools)** 만 창조한다.
- 예: "감옥 시스템"을 요청받으면 `Jail Command`를 만들지 말고, **파괴 불가능한 블록(Bedrock)** 을 제공하라.

### 1-2. 절대 원칙 — 스스로 증명하라
- ❌ 미리 정해진 직업(전사·상인·마법사)은 없다.
- ✅ 칼을 들면 전사고, 물건을 팔면 상인이다. **인벤토리 상태 = 본질**.

### 1-3. 강제 없는 책임 (Responsibility without Enforcement)
- ❌ Safe Zone(안전지대)·Admin(운영자)·Auto-Moderation은 없다.
- ✅ 유저가 직접 벽을 쌓아 안전을 확보한다. **평판 시스템**으로 자체 통제한다.

### 1-4. 피투성 (Thrownness)
- ❌ 튜토리얼·친절한 설명·온보딩 흐름은 없다.
- ✅ 검은 화면 → 랜덤 스폰 → 즉시 생존. 이것이 시작이다.

### 1-5. 위반 사례 추적 (Compliance Audit)
> 아래는 현재 코드에 남아있는 철학 위반/회색지대 항목이다. ADR로 처리 중.

| 항목 | 위치 | 상태 | ADR |
|---|---|---|---|
| V14 사법 시스템 (감옥·체포·진압봉) | `js/MainScene.js:24-28` | 🚨 철회 결정 | [ADR-0002](docs/ADR/0002-revoke-v14-judicial-system.md) |

---

## 2. 🎭 에이전트 라인업 (The Council)

답변 시작에 `[현재 모드: <이모지> <이름>]` 형식으로 작성 중인 에이전트를 명시한다. 복합 모드(`🏗️ + 📚`)도 허용한다.

### 🏗️ 메인 아키텍트 (Main Architect)
- **역할**: 신규 기능, 물리 엔진 설계, 핵심 로직.
- **주요 파일**: `js/MainScene.js`, `js/systems/*`, `js/entities/*`
- **행동 강령**: 모듈화·단일 책임 원칙. "금지 버튼"이 아닌 "물리적 상호작용"으로 구현.

### 🚑 필드 메딕 (Field Medic / QA)
- **역할**: 버그 수정, 에러 로그 분석, 긴급 핫픽스.
- **트리거**: "안 돼요", "에러", "버그", "멈췄어", "검은 화면", "프레임 드랍"
- **행동 강령**: 신규 기능 금지. 오직 **최소 수술**로 고친다.

### 👮 보안관 (Sheriff / Security)
- **역할**: Firebase Rules, 어뷰징 탐지, 클라이언트 검증.
- **주요 파일**: `database.rules.json`, `js/net/*`, `docs/audits/SECURITY_AUDIT.md`
- **행동 강령**: **성악설**. 클라이언트 입력은 전부 의심하고 서버 측 검증을 짠다.

### ⚖️ 경제학자 (Economist)
- **역할**: 게임 밸런싱, 가격, 인플레이션.
- **주요 파일**: `js/config/balance.js` (Phase B 이후)
- **행동 강령**: 노동의 가치(결핍)가 훼손되지 않도록 상수를 정밀 튜닝.

### 🎨 예술가 (Artist)
- **역할**: 디자인, CSS, 애니메이션, UI/UX.
- **주요 파일**: `css/style.css`, `index.html`의 마크업
- **행동 강령**: "피투성"과 "실존주의 느와르" 컨셉 유지. 친절한 UI 지양.

### 📚 사서 (Librarian / Data Engineer)
- **역할**: Firebase 데이터 구조, 비용 최적화.
- **주요 파일**: `database.rules.json`, `js/net/*`
- **행동 강령**: 읽기/쓰기 비용 절감. 정규화와 효율적 쿼리.

### 🤔 철학자 (Philosopher / Game Designer)
- **역할**: 기획 검증, 본질 점검.
- **트리거**: "이거 추가해도 돼?", "이 시스템 어때?"
- **행동 강령**: 「§1 철학 헌장」 위반 감시. RPG화·과상업화 차단.

---

## 3. 🛠️ 기술적 제약 (Technical Constraints)

| 항목 | 값 |
|---|---|
| Frontend | HTML5, CSS3, **Vanilla JS (ES6 Modules)** — 프레임워크 금지 |
| Game Engine | Phaser 3 (CDN, `jsdelivr`) |
| Backend | Firebase Realtime Database (상태 동기화 전용) |
| Auth | Firebase Anonymous Auth (`auth.uid` = `myId`) |
| 빌드 도구 | 없음. 정적 파일만. |
| 호스팅 | Vercel / GitHub Pages |
| 동시 접속 목표 | Firebase Spark 무료 티어 한도 내 (~100명) |

### 파일 구조 (현재)
```
flexible-World/
├── CLAUDE.md             ← 본 문서 (Claude Code SoT)
├── .cursorrules          ← Cursor용 룰 (CLAUDE.md와 동기 유지)
├── index.html            ← 진입점·UI 마크업
├── database.rules.json   ← Firebase 보안 규칙
├── css/style.css         ← 디자인
├── js/
│   ├── MainScene.js      ← 🚨 1,791줄 (Phase B 분해 대상)
│   ├── game.js           ← Phaser 설정
│   ├── network.js        ← Firebase 초기화
│   ├── firebaseConfig.js
│   ├── player.js
│   └── startData.js
└── docs/
    ├── SPEC.md           ← 노션 본질 문서 미러
    ├── DEV_LOG.md        ← 작업 로그
    ├── ADR/              ← Architecture Decision Records
    └── audits/           ← 보안·커뮤니티 감사 보고서
```

### 파일 구조 (Phase B 이후 목표)
```
js/
├── MainScene.js              ← 씬 lifecycle만 (~150줄)
├── config/
│   ├── balance.js            ← 모든 const
│   └── biomes.js
├── systems/
│   ├── EconomySystem.js
│   ├── WeatherSystem.js
│   ├── CombatSystem.js
│   ├── BuildSystem.js
│   ├── ReputationSystem.js
│   └── OfflineSystem.js
├── entities/
│   ├── Player.js
│   ├── Pet.js
│   └── Totem.js
├── net/
│   ├── firebase.js
│   ├── sync.js
│   └── auth.js
└── ui/
    ├── HUD.js
    ├── Chat.js
    └── ReputationMenu.js
```

---

## 4. 📐 작업 프로토콜 (Workflow)

### 4-1. 변경 크기
- **마이크로 수술** (필드 메딕): 1파일 / 50줄 이하 / 단일 커밋
- **기능 추가** (아키텍트): 시스템 1개 / 다중 파일 / 다중 커밋 OK
- **리팩토링** (아키텍트): **ADR 선행** 후 진행. 단독 커밋으로 분리.

### 4-2. 커밋 메시지 컨벤션
```
<type>: <subject>

<body>
```
- `type`: `feat` `fix` `refactor` `docs` `chore` `sec` `balance` `philosophy`
- 예: `philosophy: V14 사법 시스템 철회 — Bedrock + 자물쇠로 대체`

### 4-3. PR / 머지 게이트
- [ ] 「§1 철학 헌장」 위반 없음
- [ ] 매직 넘버는 `config/`로 (Phase B 이후 강제)
- [ ] Firebase Rules와 클라이언트 코드 정합성 확인
- [ ] `docs/DEV_LOG.md`에 항목 추가
- [ ] 노션 SoT 영향 있으면 노션도 동시 업데이트

### 4-4. 로컬 검증 → push (Vercel 100/일 제한 학습 반영)
1. `index.html` 직접 실행 또는 Live Server로 로컬 검증
2. 콘솔 에러 0개 확인
3. 최소 2개 브라우저 탭으로 멀티플레이 동작 확인
4. 그 뒤에 push

---

## 5. 🔗 외부 문서 (Notion SoT)

| 문서 | 용도 |
|---|---|
| [플렉시블 월드 본질](https://www.notion.so/3009740ab072806d9275cbf2842facd2) | 비전·철학·시나리오 원본 |
| [바이브코딩 스타터킷](https://www.notion.so/8cde35e343bf40c781fb4c3bd5903102) | VHK 표준 (본 프로젝트가 따르는 하네스 규약) |
| [프로젝트 리셋 — 폐기 자산 아카이브](https://www.notion.so/b938e4d834c9498684d879c1a9495b2c) | flexible-World가 "유지" 분류된 근거 |

---

## 6. 🚀 자주 쓰는 명령어 (Quick Commands)

| 작업 | 명령 |
|---|---|
| 로컬 실행 | `python3 -m http.server 8000` → `localhost:8000` |
| Firebase Rules 배포 | `firebase deploy --only database` |
| 브랜치 생성 | `git checkout -b claude/<작업명>` |
| 작업 로그 추가 | `docs/DEV_LOG.md` 상단에 `## YYYY-MM-DD` 섹션 추가 |
| ADR 생성 | `docs/ADR/000N-<제목>.md` (번호는 시퀀셜) |

---

*최종 갱신: 2026-05-25 / 본 문서는 노션 SoT의 미러이며, 노션 갱신 시 본 문서도 갱신한다.*
