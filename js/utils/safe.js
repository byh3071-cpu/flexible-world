/**
 * utils/safe.js — 안전한 값 추출 유틸
 *
 * Firebase 등 외부 데이터는 무엇이든 빠질 수 있다는 가정 하에,
 * 모든 읽기 경로를 이 두 함수로 통과시킨다.
 */

export const safeVal = (v, def = null) => (v != null ? v : def);

export const safeNum = (v, def = 0) =>
    (typeof v === 'number' && !isNaN(v) ? v : def);
