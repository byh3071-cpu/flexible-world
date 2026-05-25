# ADR-0004: 죽은 코드 `js/player.js` 삭제

- **Status**: Accepted
- **Date**: 2026-05-25
- **Deciders**: 🚑 필드 메딕, 🏗️ 메인 아키텍트
- **Tags**: dead-code, refactor

## Context

`js/player.js`는 IIFE + `window.FW.State` 글로벌 패턴으로 작성된 66줄짜리 파일이다. 그러나 다음 5가지가 모두 확인되었다:

| 검증 항목 | 결과 |
|---|---|
| `index.html`에 `<script src="js/player.js">` 태그 존재 | ❌ 없음 |
| 다른 .js가 `import ... from './player.js'` 하는가 | ❌ 없음 |
| `window.FW`나 `FW.player.*` 호출이 다른 곳에 존재 | ❌ 없음 |
| 파일 내 정의된 함수(`handlePlayerUpdate`/`drawHpBar`/`showChatBubble`)의 호출자 | ✅ 있음 — 단, `MainScene.js` 내부에 **동명의 클래스 메서드가 별도로 구현되어 있음** (`MainScene.js:1172, 1255, 1282`). player.js의 글로벌 객체와 무관. |
| 마지막 수정일 | 2026-02-07 (3.5개월 전, V13 이전) |

`MainScene.js`로 로직이 통합되면서 player.js는 옛 글로벌 패턴 잔재로 남았다. 게다가 시그니처도 다르다(예: `showChatBubble`의 매개변수 수가 3 vs 4).

## Decision

`js/player.js`를 삭제한다.

부수적 이유:
- 죽은 코드는 신규 작업자(에이전트 포함)를 혼란시킨다. ("어떤 player가 진짜?")
- Phase B 시스템 분해 시 `js/entities/Player.js`를 새로 만들 예정인데, 이름 충돌 위험을 미리 제거한다.
- 글로벌 `window.FW.*` 패턴은 본 프로젝트의 ES6 모듈 방침과 정면 충돌한다.

## Consequences

### Positive
- 코드 베이스 -66줄, 혼란 -1.
- `js/entities/Player.js` 신설 시 이름 충돌 위험 0.

### Negative
- 없음 (호출자 0).

### Mitigations
- Git history에 영구 보존되므로, 만약 누군가 "그 옛 코드 어디 갔지?" 묻는다면 `git log -- js/player.js`로 복원 가능.

## References

- 사전 분석: `docs/DEV_LOG.md` 2026-05-25 Phase B-2 항목 "발견" 줄
- 신규 위치 (예정): `js/entities/Player.js`
