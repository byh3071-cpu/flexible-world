# Flexible-World Dev Log

> 변경 단위로 1줄 이상 남긴다. 신규 항목은 **상단**에 추가.
> 본 로그는 노션 Dev Log와 별도이며, 코드 변경 추적 전용.

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
