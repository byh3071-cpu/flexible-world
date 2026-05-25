# ADR-0003: Source of Truth 정책 — Notion이 SoT, docs/는 미러

- **Status**: Accepted
- **Date**: 2026-05-25
- **Deciders**: 📚 사서, 🤔 철학자
- **Tags**: documentation, governance

## Context

본 프로젝트의 비전·철학·기획은 다음 두 곳에 분산되어 있었다:

| 위치 | 문서 |
|---|---|
| Notion | 「플렉시블 월드 본질」, 「바이브코딩 스타터킷」 등 |
| Repo Root | `.cursorrules`, `COMMUNITY_AUDIT.md`, `SECURITY_AUDIT.md` |

문제:
- 노션과 로컬 문서가 따로 진화 → 어느 쪽이 진실인지 모호
- 새 에이전트(Claude·Cursor)가 로컬 문서만 보고 노션의 풍부한 맥락(자활센터 경험 등)을 놓침

## Decision

### 정책

| 종류 | 위치 | SoT? |
|---|---|---|
| **비전·철학·서사·기획 원문** | Notion | ✅ Yes |
| **기술 명세·ADR·작업 로그** | `docs/` | ✅ Yes (이 범주 한정) |
| **코드 베이스 룰** | `CLAUDE.md`, `.cursorrules` | ✅ Yes (코드 측 SoT) |
| 비전·철학의 로컬 사본 | `docs/SPEC.md` | ❌ Mirror only |

### 동기화 규칙

1. **비전·철학 변경** → 노션 먼저 수정 → `docs/SPEC.md` 즉시 미러 → 같은 PR에 묶기.
2. **기술 결정** → `docs/ADR/` 먼저 작성 → 필요시 노션 Dev Log에 요약 동기화.
3. **코드 룰 변경** → `CLAUDE.md` 먼저 수정 → `.cursorrules`도 동기 (둘은 같은 룰의 다른 도구용 표현).
4. 어떤 문서든 상단에 "Mirror" 여부와 동기화 일자를 명시.

### 자동화 (추후)

- VHK의 `vhk sync` 또는 `notion-mcp` 활용해 노션 → `docs/SPEC.md` 자동 미러 (Phase B 이후 검토).

## Consequences

### Positive
- "어디를 봐야 하지?" 모호함 제거.
- 노션의 풍부한 맥락이 코드 작업자에게도 닿음.
- Git 이력으로 미러 시점 추적 가능.

### Negative
- 동기화 누락 위험 → 미러 상단의 "최종 동기화" 일자로 강제.
- 두 곳을 갱신해야 하는 비용 → 자동화로 완화 예정.

## References

- `CLAUDE.md` §5 「외부 문서 (Notion SoT)」
- `docs/SPEC.md` 상단 동기화 헤더
