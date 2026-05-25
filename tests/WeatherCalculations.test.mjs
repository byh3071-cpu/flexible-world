/**
 * tests/WeatherCalculations.test.mjs
 * 실행: node --test tests/*.test.mjs
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
    WEATHER_TYPES, isValidWeather, pickNextWeather, getBiome, weatherToast,
} from '../js/systems/weather.calculations.js';
import { BIOME_SNOW_Y, BIOME_DESERT_X } from '../js/config/balance.js';

/* === isValidWeather === */
test('isValidWeather: 알려진 3종은 true', () => {
    for (const w of WEATHER_TYPES) assert.equal(isValidWeather(w), true);
});

test('isValidWeather: 모르는 값·잘못된 타입은 false', () => {
    assert.equal(isValidWeather('storm'), false);
    assert.equal(isValidWeather(''), false);
    assert.equal(isValidWeather(null), false);
    assert.equal(isValidWeather(undefined), false);
    assert.equal(isValidWeather(123), false);
    assert.equal(isValidWeather({}), false);
});

/* === pickNextWeather === */
test('pickNextWeather: rand 시드 0 → 첫 번째 타입', () => {
    assert.equal(pickNextWeather(() => 0), WEATHER_TYPES[0]);
});

test('pickNextWeather: rand 시드 0.99 → 마지막 타입', () => {
    assert.equal(pickNextWeather(() => 0.99), WEATHER_TYPES[WEATHER_TYPES.length - 1]);
});

test('pickNextWeather: 어떤 rand 값이든 항상 유효 날씨 반환', () => {
    for (let i = 0; i < 10; i++) {
        const r = i / 10;
        const result = pickNextWeather(() => r);
        assert.ok(isValidWeather(result), `rand=${r} → ${result}`);
    }
});

test('pickNextWeather: 인자 없으면 Math.random 사용', () => {
    const result = pickNextWeather();
    assert.ok(isValidWeather(result));
});

/* === getBiome === */
test('getBiome: y < SNOW_Y → snow (사막보다 우선)', () => {
    assert.equal(getBiome(BIOME_DESERT_X + 100, BIOME_SNOW_Y - 1), 'snow');
});

test('getBiome: 일반 y, x > DESERT_X → desert', () => {
    assert.equal(getBiome(BIOME_DESERT_X + 1, 300), 'desert');
});

test('getBiome: 일반 좌표 → normal', () => {
    assert.equal(getBiome(100, 300), 'normal');
});

test('getBiome: 경계값 — y == SNOW_Y는 snow 아님', () => {
    assert.equal(getBiome(100, BIOME_SNOW_Y), 'normal');
});

test('getBiome: 경계값 — x == DESERT_X는 desert 아님', () => {
    assert.equal(getBiome(BIOME_DESERT_X, 300), 'normal');
});

test('getBiome: 좌표 타입 잘못된 경우 normal로 처리', () => {
    assert.equal(getBiome(null, null), 'normal');
    assert.equal(getBiome(undefined, undefined), 'normal');
});

/* === weatherToast === */
test('weatherToast: acid_rain → 산성비 메시지', () => {
    assert.ok(weatherToast('acid_rain').includes('산성비'));
});

test('weatherToast: rain → 비 이모지', () => {
    assert.ok(weatherToast('rain').includes('🌧'));
});

test('weatherToast: clear → 맑음', () => {
    assert.ok(weatherToast('clear').includes('맑음'));
});

test('weatherToast: 알 수 없는 값 → clear와 동일 fallback', () => {
    assert.equal(weatherToast('storm'), weatherToast('clear'));
});
