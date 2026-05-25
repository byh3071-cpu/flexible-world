/**
 * weather.calculations.js — V18 날씨·바이옴 순수 계산
 *
 * 이 모듈은 Phaser·Firebase·DOM 의존이 **없다**. Node 단위 테스트 가능.
 * 시각효과 적용·DB 동기화는 호출자(MainScene 또는 향후 WeatherSystem 클래스)에서.
 */

import { BIOME_SNOW_Y, BIOME_DESERT_X } from '../config/balance.js';

/** 서버에 저장되는 유효 날씨 종류. */
export const WEATHER_TYPES = ['clear', 'rain', 'acid_rain'];

/** 알려진 날씨인지 검증. 외부 입력 방어용. */
export function isValidWeather(w) {
    return typeof w === 'string' && WEATHER_TYPES.includes(w);
}

/**
 * 다음 날씨를 의사 랜덤으로 선택.
 *
 * @param {() => number} [rand=Math.random] - 0~1 난수 함수 (테스트 시 시드 주입)
 * @returns {'clear'|'rain'|'acid_rain'}
 */
export function pickNextWeather(rand = Math.random) {
    return WEATHER_TYPES[Math.floor(rand() * WEATHER_TYPES.length)];
}

/**
 * 플레이어 좌표로 현재 바이옴 판정.
 *
 * @param {number} x - 월드 x 좌표
 * @param {number} y - 월드 y 좌표
 * @returns {'snow'|'desert'|'normal'}
 */
export function getBiome(x, y) {
    if (typeof y === 'number' && y < BIOME_SNOW_Y) return 'snow';
    if (typeof x === 'number' && x > BIOME_DESERT_X) return 'desert';
    return 'normal';
}

/** 날씨 변경 시 보여줄 토스트 메시지. */
export function weatherToast(weatherType) {
    if (weatherType === 'acid_rain') return '☠️ 산성비!';
    if (weatherType === 'rain') return '🌧 비';
    return '☀️ 맑음';
}
