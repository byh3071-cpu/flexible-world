/**
 * balance.js — Flexible-World 전역 밸런스 상수
 *
 * 이 파일은 ⚖️ 경제학자(Economist) 페르소나의 단독 영토다.
 * 모든 매직 넘버는 여기에 모인다. `MainScene.js`나 다른 곳에서 const를 새로 만들지 말 것.
 *
 * 카테고리 순서: WORLD → ECONOMY → COMBAT → TNT → TOTEM → UI →
 *               V14 JUDICIAL (DEPRECATED) → PETS → V18 BIOME/WEATHER → V17 OFFLINE
 *
 * 변경 시: `docs/DEV_LOG.md`에 1줄 남기고, 의미 있는 밸런스 조정이면 ADR 작성.
 */

/* === WORLD (월드 크기) === */
export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 600;

/* === ECONOMY (자원 채집·소모) === */
export const ROCK_TARGET = 25;
export const TREE_TARGET = 25;
export const REMAINING_PER = 6;      /* 8→6: 채집지당 수확량 감소, 인플레이션 완화 */
export const SHOUT_COST = 50;

/* === COMBAT (주먹·체력) === */
export const FIST_PLAYER_DAMAGE = 25;   /* 20→25: 5회→4회 사망, 긴장감 상승 (V8) */
export const FIST_TOTEM_DAMAGE = 25;

/* === TNT (V13) === */
export const TNT_EXPLODE_DELAY = 3000;
export const TNT_EXPLODE_RADIUS = 96;
export const TNT_PLAYER_DAMAGE = 100;   /* 즉사 유지 */
export const TNT_TOTEM_DAMAGE = 1000;
export const TNT_COST_STONE = 60;       /* 50→60: TNT 비용 상승 */
export const TNT_COST_WOOD = 60;
export const TNT_COST_HP = 60;

/* === TOTEM (부족·영역) === */
export const TERRITORY_RADIUS = 20 * 32;
export const TOTEM_REPAIR_COST = 12;    /* 10→12: 토템 수리 비용 상승 */
export const TOTEM_REPAIR_AMOUNT = 500;

/* === UI / ANNOUNCEMENT === */
export const REPUTATION_DISPLAY_DURATION = 3000;
export const ANNOUNCEMENT_DURATION = 5000;

/* === V14 JUDICIAL — ⚠️ DEPRECATED (ADR-0002 철회 예정) === */
/* Phase C에서 Bedrock + Lock 도구로 대체. 신규 코드에서 참조 금지. */
export const PRISON_CENTER_X = 64;
export const PRISON_CENTER_Y = 64;
export const PRISON_GRID_MIN = -16;
export const PRISON_GRID_MAX = 176;     /* 5x5 내부 + 벽 둘러쌈 */
export const JAIL_DURATION_MS = 30000;
export const ARREST_REP_THRESHOLD = -20; /* 이 평판 이하만 체포 가능 */
export const BATON_REP_REQUIRED = 20;    /* 진압봉 사용 최소 평판 */

/* === V15 PET & CUSTOMIZATION === */
export const PET_FOLLOW_LERP = 0.08;     /* 펫 추적 부드러움 */
export const PET_FOLLOW_DIST = 40;       /* 주인과 유지 거리 */

/* === V18 BIOME (설원·사막) === */
export const BIOME_SNOW_Y = 80;             /* y < 이 값: 설원 (화면 상단) */
export const BIOME_DESERT_X = WORLD_WIDTH - 80; /* x > 이 값: 사막 (우측 끝) */
export const SNOW_HP_PER_SEC = 1;
export const DESERT_SPEED_MULT = 0.5;
export const CRYSTAL_TARGET = 8;            /* 설원·사막 각 구역당 수 */
export const CRYSTAL_REMAINING = 3;

/* === V18 WEATHER (날씨·산성비) === */
export const WEATHER_INTERVAL_MS = 180000;   /* 3분 */
export const ACID_RAIN_DAMAGE = 5;           /* 산성비 초당 데미지 */
export const ACID_RAIN_BLOCK_DAMAGE = 2;     /* 건물 초당 데미지 */

/* === V17 OFFLINE SIMULATION === */
export const OFFLINE_RATE = 0.1;             /* 오프라인 시 감소 속도 10% */
export const OFFLINE_24H_SEC = 86400;        /* 24시간 (초) */
export const PET_HUNGER_PER_SEC = 1 / 600;   /* 배고픔 1당 600초 (10분) */
export const PET_HUNGER_MAX = 100;           /* 100 도달 시 펫 도망 */
export const TOTEM_ENTROPY_PER_SEC = 10000 / 8640;
/* 24h 오프라인 시 토템 파괴 (8640 = 24h * 0.1 = OFFLINE_24H_SEC * OFFLINE_RATE) */
