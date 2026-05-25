# Architecture Decision Records (ADR)

> 주요 설계·기획 결정을 기록한다. 번호는 시퀀셜, 한 번 부여하면 재사용 금지.
> 새 ADR은 `000N-<짧은-제목>.md` 형식. 상위 ADR을 대체할 경우 status를 `Superseded by ADR-NNNN`으로.

| # | 제목 | Status | 태그 |
|---|---|---|---|
| [0001](./0001-philosophy-charter.md) | 철학 헌장을 코드 머지 게이트로 격상 | Accepted | governance, philosophy |
| [0002](./0002-revoke-v14-judicial-system.md) | V14 사법 시스템 철회 — Bedrock + Lock으로 대체 | Proposed (Phase C 실행 대기) | philosophy-violation, refactor |
| [0003](./0003-source-of-truth-policy.md) | Notion = SoT, `docs/` = Mirror | Accepted | documentation, governance |
| [0004](./0004-remove-dead-player-js.md) | 죽은 코드 `js/player.js` 삭제 | Accepted | dead-code, refactor |

---

## 새 ADR 템플릿

```md
# ADR-NNNN: <짧은 제목>

- **Status**: Proposed | Accepted | Superseded by ADR-XXXX | Deprecated
- **Date**: YYYY-MM-DD
- **Deciders**: <에이전트 페르소나>
- **Tags**: <태그들>

## Context
왜 이 결정이 필요한가? 어떤 문제·제약·기회가 있는가?

## Decision
무엇을 결정했는가? 대안(있다면)과 그 기각 이유는?

## Consequences
### Positive
### Negative
### Mitigations

## References
관련 ADR·문서·코드 링크
```
