# Flexible-World Dev Log

> 변경 단위로 1줄 이상 남긴다. 신규 항목은 **상단**에 추가.
> 본 로그는 노션 Dev Log와 별도이며, 코드 변경 추적 전용.

---

## 2026-05-25 — 정리: README·.gitignore·ADR 인덱스·CLAUDE.md 동기화

- **🎨 예술가 + 📚 사서**: 저장소 첫 인상 정리.
  - `README.md` 신설 — 1줄 소개, 철학 4원칙, 실행·테스트 명령, 구조 링크.
  - `.gitignore` 채움 — IDE/OS/로그/Node/.env/Firebase 로컬 산출물/빌드 산출물.
  - `docs/ADR/README.md` 신설 — 4개 ADR 인덱스 표 + 새 ADR 템플릿.
  - `CLAUDE.md` §3 파일 구조 — 현재 코드와 1:1 동기화 + Phase B 목표 트리에 ✅ 표시.
- 코드 변경 0. 문서·메타 파일만.

---

## 2026-05-25 — Phase B-5: OfflineSystem 순수 함수화 + 첫 단위 테스트

- **🏗️ 메인 아키텍트**: `OfflineSystem.calculateCatchUp` 를 별도 모듈 `js/systems/offline.calculations.js` 로 분리.
  - 의도: Firebase·Phaser·DOM 의존 0 → Node 환경에서 단위 테스트 가능.
  - 부수효과(DB 쓰기, scene 변형, 토스트, 타이머)는 `OfflineSystem` 클래스에 잔류.
- **🚑 필드 메딕**: `tests/OfflineSystem.test.mjs` 신설, **16개 단위 테스트** 작성 (Node 22 native `node:test`).
  - 시나리오: lastLogin 0 / 펫 굶주림 누적·한계·24h / 알 수 없는 펫 종류 / 토템 일부·전부 손실 / 24h 강제 / 남의 토템 / 부족 토템 파괴 시 tribeId 초기화 / 토스트 60초 임계 / 펫 도망 메시지 조건 / petHunger clamp / null 입력 방어.
  - 결과: **16/16 pass, 130ms**.
- CLAUDE.md §6 「자주 쓰는 명령어」에 `node --test tests/*.test.mjs` 추가.
- 폰 환경에서도 회귀 안전망 작동 시작. 앞으로 시스템 추출 시 동일 패턴 (순수+클래스+테스트).

---

## 2026-05-25 — Phase B-4: OfflineSystem 추출 (첫 시스템 분해)

- **🏗️ 메인 아키텍트**: `js/systems/OfflineSystem.js` 신설 (153줄). MainScene 의 V17 로직 두 메서드를 이주:
  - `loadUserDataAndCatchUp` → `OfflineSystem.loadAndApply` (게임 진입 시 1회 catchUp 계산·자동 동기화 등록)
  - `syncUserDataForOffline` → `OfflineSystem.syncNow` (변경 즉시 동기화, 호출 지점 7개)
- 설계: `OfflineSystem(scene)` — scene 참조로 phaser 상태에 접근. 추후 순수 함수화는 별도 PR(예정).
- MainScene.js: 1,761 → 1,632줄 (**−129줄**, ≈7%). 더 이상 안 쓰는 상수 6개 import 제거.
- 주석 안의 옛 메서드 이름까지 정리.
- 표준 4 게이트 통과 (syntax / 모듈 그래프 / 옛 이름 grep / 줄 수 확인).

---

## 2026-05-25 — Phase B-3: 죽은 코드 player.js 삭제

- **🚑 필드 메딕**: `js/player.js` 삭제 (66줄).
- 5단계 검증으로 죽은 코드 확정: index.html 미로드 / 어떤 모듈도 import 안 함 / `window.FW` 호출자 0 / 함수들의 진짜 구현은 MainScene.js 내부에 별도 존재 / 최종 수정 3.5개월 전.
- ADR-0004 작성 — 삭제 결정 근거와 향후 `js/entities/Player.js` 신설 시 이름 충돌 방지 효과 기록.
- 표준 검증 게이트 3종 통과 (node --check, 정적 모듈 그래프, 옛 경로 grep).

---

## 2026-05-25 — Phase B-2: utils/ + net/ 분리

- **🏗️ 메인 아키텍트**: `MainScene.js`의 헬퍼 함수 → `js/utils/safe.js`(safeVal·safeNum) + `js/utils/time.js`(formatOfflineTime).
- **📚 사서**: `js/network.js` + `js/firebaseConfig.js` → `js/net/firebase.js` + `js/net/config.js` 로 디렉토리 이전.
- `MainScene.js`와 `game.js`의 import 경로 갱신.
- 기존 루트 레벨 `network.js`, `firebaseConfig.js` 삭제.
- 6개 파일 syntax check 통과. 옛 경로 참조 grep으로 0건 확인.
- 발견: `js/player.js`는 `window.FW` 글로벌 패턴이지만 어디서도 로드/import 안 됨 → **죽은 코드 추정**. 다음 PR에서 별도 ADR로 검토.

---

## 2026-05-25 — Phase B-1: balance.js 분리

- **🏗️ 메인 아키텍트 + ⚖️ 경제학자**: `MainScene.js` 상단 43개 const → `js/config/balance.js`로 이주.
- 카테고리: WORLD / ECONOMY / COMBAT / TNT / TOTEM / UI / V14 JUDICIAL(deprecated) / PET / V18 BIOME / V18 WEATHER / V17 OFFLINE.
- V14 사법 상수들은 `⚠️ DEPRECATED` 헤더로 격리 — ADR-0002에서 Phase C 철회 예정.
- `MainScene.js`: 1,791줄 → 1,768줄 (변경 후), import 블록 한 곳에 집중.
- syntax check 통과 (`node --check`).
- ⚖️ 경제학자 모드가 이제 단독 영토(balance.js) 보유.

---

## 2026-05-25 — Phase A: 하네스 구축

- **🏗️ 메인 아키텍트 + 📚 사서**: `CLAUDE.md` 신규 작성 — 7 에이전트 페르소나, 철학 헌장, 작업 프로토콜, 노션 SoT 링크 통합.
- **📚 사서**: `docs/` 디렉토리 구조 신설 (`SPEC.md`, `ADR/`, `audits/`).
- **📚 사서**: `docs/SPEC.md` — 노션 「플렉시블 월드 본질」을 텍스트 미러로 로컬화. 상단에 SoT 경고 헤더 명시.
- **🤔 철학자**: ADR-0001 — 철학 헌장을 코드 머지 게이트로 격상.
- **🤔 철학자**: ADR-0002 — V14 사법 시스템 철회 결정 (Phase C에서 실행 예정).
- **📚 사서**: ADR-0003 — Notion = SoT, `docs/` = Mirror 정책 확정.
- **📚 사서**: 기존 `COMMUNITY_AUDIT.md`, `SECURITY_AUDIT.md` → `docs/audits/` 이동 (루트 정리).

### 다음 단계
- **Phase B** (예정): `js/MainScene.js` 1,791줄 → `config/`, `systems/`, `entities/`, `net/`, `ui/` 모듈 분해.
- **Phase C** (예정): ADR-0002 실행 — V14 사법 시스템 코드 제거, Bedrock + Lock 도입.
