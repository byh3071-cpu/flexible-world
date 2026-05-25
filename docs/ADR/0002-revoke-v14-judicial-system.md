# ADR-0002: V14 사법 시스템 철회 — Bedrock + Lock 도구로 대체

- **Status**: Proposed (Phase C에서 실행)
- **Date**: 2026-05-25
- **Deciders**: 🤔 철학자, 🏗️ 메인 아키텍트, ⚖️ 경제학자
- **Tags**: philosophy-violation, refactor, breaking-change-candidate

## Context

`js/MainScene.js:24-28`에 V14에서 도입된 사법 시스템 상수가 존재한다:

```js
const PRISON_CENTER_X = 64, PRISON_CENTER_Y = 64;
const PRISON_GRID_MIN = -16, PRISON_GRID_MAX = 176;
const JAIL_DURATION_MS = 30000;
const ARREST_REP_THRESHOLD = -20;
const BATON_REP_REQUIRED = 20;
```

이 시스템은 다음을 의미한다:
- 개발자가 **물리 좌표로 감옥 위치를 직접 지정** (PRISON_CENTER_*)
- **체포 권한을 평판 점수로 자동 부여** (BATON_REP_REQUIRED ≥ 20)
- **수감 기간을 시스템이 자동 종료** (JAIL_DURATION_MS = 30초)

이는 「철학 헌장」 1-1 「이신론적 신」, 1-3 「강제 없는 책임」을 명백히 위반한다.

### 노션 SoT의 원문

> "감옥 시스템을 개발하는 게 아니라, 벽돌(Block)과 자물쇠(Lock)라는 도구만 던져주고, 감옥을 짓든 집을 짓든 알아서 해라."

V14는 정확히 이 가이드의 반대 방향이다.

## Decision

### Plan A — 완전 철회 (선택됨)

1. `PRISON_*`, `JAIL_DURATION_MS`, `ARREST_REP_THRESHOLD`, `BATON_REP_REQUIRED` 상수 제거.
2. 진압봉 아이템, 체포 로직, 자동 수감 로직 제거.
3. 다음 도구만 제공:
   - **Bedrock 블록**: 채집·파괴 불가능한 벽돌. 토템 또는 후원자 배지 보유 유저만 설치 가능 (밸런스는 ⚖️ 경제학자 결정).
   - **자물쇠(Lock) 아이템**: 문(Door) 블록에 부착 가능. 자물쇠의 키를 가진 자만 통과.
4. → 유저가 직접 Bedrock으로 벽을 쌓아 감옥을 짓고, 자물쇠로 잠근다. 시스템 개입 0.

### Plan B — 하이브리드 (기각)

평판 -20 이하 유저는 시스템이 자동으로 특정 zone 입장 제한.
- ❌ 기각 사유: "자동으로"라는 점에서 여전히 시스템 개입. 1-3 위반.
- 단, 노션 SoT 원문의 *"점수가 낮으면 특정 구역 입장이 제한되는 식으로 시스템이 자동으로 격리"* 와 부분 일치하므로, 별도 ADR(미래)에서 재논의 여지 남김.

## Migration Plan

| 단계 | 작업 | 영향 |
|---|---|---|
| 1 | Bedrock 블록 타입 추가, Firebase Rules 업데이트 | 신규 기능 |
| 2 | Lock 아이템 도입, Door 블록 확장 | 신규 기능 |
| 3 | V14 상수·로직 제거, UI 진압봉 표시 제거 | **Breaking** — 기존 감옥 유저 영향 |
| 4 | 공지: "낡은 감옥은 무력화됩니다. Bedrock으로 다시 지으세요." | 게임 내 announcement |
| 5 | Firebase에서 `jailedUntil` 필드 정리 (마이그레이션) | DB 정리 |

## Consequences

### Positive
- 「철학 헌장」 위반 0건 달성.
- "감옥을 지은 유저"가 진짜 권력을 얻음 → 정치 시뮬레이션이 진짜로 작동.
- 코드 단순화 (사법 로직 ~200줄 추정 제거).

### Negative
- 이미 V14 사법 시스템에 익숙한 유저는 기능 회귀로 느낄 수 있음.
- "악성 유저를 어떻게 처리하지?" 라는 운영 부담이 다시 유저에게 돌아감 (이게 의도).

### Mitigations
- 게임 내 announcement로 사전 공지 (3일 이상).
- Bedrock + Lock의 첫 1주는 채집 비용 할인 (⚖️ 경제학자 튜닝).

## Open Questions

- Bedrock의 설치 조건: 토템 보유? 평판 +20? 둘 다? → ⚖️ 경제학자 결정 필요.
- 자물쇠 키의 분실/도난 메커닉: 어디까지 허용할 것인가?
- 정말 폭력적인 유저(악성)가 모든 유저를 압도하면? → 노션 SoT 「4. 시뮬레이션」 단계 그대로 진행. 개입하지 않는다.

## References

- 위반 코드: `js/MainScene.js:24-28` (V14)
- 원칙: `CLAUDE.md` §1-1, §1-3
- SoT: Notion 「플렉시블 월드 본질」 §"개발자가 제공해야 할 3가지 절대 법칙"
- 선행: ADR-0001
