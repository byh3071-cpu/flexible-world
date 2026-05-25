/**
 * utils/time.js — 시간 포맷 유틸
 */

/** 초 단위를 "N시간 M분" 형식으로 변환 (V17 오프라인 시뮬레이션용) */
export function formatOfflineTime(seconds) {
    if (seconds < 60) return `${Math.floor(seconds)}초`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}분`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return remainMins > 0 ? `${hours}시간 ${remainMins}분` : `${hours}시간`;
}
