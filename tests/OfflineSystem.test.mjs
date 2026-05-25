/**
 * tests/OfflineSystem.test.mjs
 *
 * 실행:  node --test tests/
 *
 * 대상: js/systems/OfflineSystem.js 의 순수 함수 `calculateCatchUp`.
 * Firebase·Phaser 의존 없음. 폰 환경에서도 회귀 검증 가능.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateCatchUp } from '../js/systems/offline.calculations.js';
import {
    OFFLINE_RATE, OFFLINE_24H_SEC,
    PET_HUNGER_PER_SEC, PET_HUNGER_MAX, TOTEM_ENTROPY_PER_SEC,
} from '../js/config/balance.js';

const NOW = 1_700_000_000_000;
const MY_ID = 'user-test';
const SECOND = 1000;

/** lastLoginTime가 없으면 catchUp 미적용. */
test('lastLogin 0 → offlineSeconds 0, 토템 액션 없음, 토스트 없음', () => {
    const diff = calculateCatchUp({}, {}, NOW, MY_ID);
    assert.equal(diff.offlineSeconds, 0);
    assert.deepEqual(diff.totemActions, []);
    assert.equal(diff.toastMessage, null);
    assert.equal(diff.petType, null);
    assert.equal(diff.petHunger, 0);
});

/** 펫이 효과시간만큼 굶주림 누적, 한계 안. */
test('펫: 한계 미만 굶주림 → petType 유지, petHunger 증가', () => {
    const oneHourAgo = NOW - 3600 * SECOND;
    const userData = { lastLoginTime: oneHourAgo, petType: 'koala', petHunger: 0 };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.equal(diff.offlineSeconds, 3600);
    assert.equal(diff.petType, 'koala');
    const expected = 3600 * OFFLINE_RATE * PET_HUNGER_PER_SEC;
    assert.ok(Math.abs(diff.petHunger - expected) < 1e-9, `expected ~${expected}, got ${diff.petHunger}`);
});

/** 펫 굶주림 한계 도달 → 도망 (null, 0). */
test('펫: 굶주림 한계 초과 → petType=null, petHunger=0', () => {
    // PET_HUNGER_MAX 도달에 필요한 effective time = MAX / PET_HUNGER_PER_SEC
    // offline 실제 시간 = effective / OFFLINE_RATE
    const needSec = PET_HUNGER_MAX / PET_HUNGER_PER_SEC / OFFLINE_RATE + 100;
    const userData = { lastLoginTime: NOW - needSec * SECOND, petType: 'alpaca', petHunger: 0 };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.equal(diff.petType, null);
    assert.equal(diff.petHunger, 0);
});

/** 24시간 이상 오프라인이면 굶주림 미달이어도 펫 도망. */
test('펫: 24h+ 오프라인 → 굶주림 무관하게 도망', () => {
    const userData = {
        lastLoginTime: NOW - (OFFLINE_24H_SEC + 1) * SECOND,
        petType: 'gecko',
        petHunger: 0,
    };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.equal(diff.petType, null);
    assert.equal(diff.petHunger, 0);
});

/** 알 수 없는 펫 종류는 굶주리지 않음 (수비적). */
test('펫: 알 수 없는 종류는 건드리지 않음', () => {
    const userData = { lastLoginTime: NOW - 3600 * SECOND, petType: 'dragon', petHunger: 5 };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.equal(diff.petType, 'dragon');
    assert.equal(diff.petHunger, 5);
});

/** 토템 hp 일부 감소 → update 액션. */
test('토템: 부분 감소 → update 액션', () => {
    const blocks = {
        '5_5': { type: 'totem', ownerId: MY_ID, hp: 10000 },
    };
    const userData = { lastLoginTime: NOW - 100 * SECOND };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.totemActions.length, 1);
    const act = diff.totemActions[0];
    assert.equal(act.type, 'update');
    assert.equal(act.key, '5_5');
    const expected = 10000 - (100 * OFFLINE_RATE * TOTEM_ENTROPY_PER_SEC);
    assert.ok(Math.abs(act.hp - expected) < 1e-6);
});

/** 토템 hp가 0 이하로 떨어지면 remove 액션. */
test('토템: hp ≤ 0 → remove 액션', () => {
    const blocks = {
        '1_1': { type: 'totem', ownerId: MY_ID, hp: 1 }, // 곧 0
    };
    // 충분히 큰 시간으로 hp를 0 이하로
    const userData = { lastLoginTime: NOW - 1000 * SECOND };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.totemActions[0].type, 'remove');
    assert.equal(diff.totemActions[0].key, '1_1');
});

/** 24시간+ 오프라인 → 모든 내 토템 강제 remove. */
test('토템: 24h+ 오프라인 → hp 무관 강제 remove', () => {
    const blocks = {
        'a': { type: 'totem', ownerId: MY_ID, hp: 99999 },
        'b': { type: 'totem', ownerId: MY_ID, hp: 99999 },
    };
    const userData = { lastLoginTime: NOW - (OFFLINE_24H_SEC + 1) * SECOND };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.totemActions.length, 2);
    assert.ok(diff.totemActions.every((a) => a.type === 'remove'));
});

/** 남의 토템은 절대 건드리지 않음. */
test('토템: 남의 토템은 액션 없음', () => {
    const blocks = {
        'mine': { type: 'totem', ownerId: MY_ID, hp: 10000 },
        'theirs': { type: 'totem', ownerId: 'other-uid', hp: 10000 },
    };
    const userData = { lastLoginTime: NOW - 100 * SECOND };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.totemActions.length, 1);
    assert.equal(diff.totemActions[0].key, 'mine');
});

/** 부족 가입했던 토템이 파괴되면 tribeId / tribeColor 초기화. */
test('부족: 가입 토템 파괴 → tribeId / tribeColor null', () => {
    const blocks = { 'myTotem': { type: 'totem', ownerId: MY_ID, hp: 1 } };
    const userData = {
        lastLoginTime: NOW - 1000 * SECOND,
        tribeId: 'myTotem',
        tribeColor: 0xff0000,
    };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.tribeId, null);
    assert.equal(diff.tribeColor, null);
});

/** 다른 토템이 파괴돼도 내 tribeId(다른 키)는 유지. */
test('부족: 가입 토템과 다른 토템이 파괴돼도 tribeId 유지', () => {
    const blocks = {
        'totemA': { type: 'totem', ownerId: MY_ID, hp: 1 },     // 파괴
        'totemB': { type: 'totem', ownerId: MY_ID, hp: 10000 }, // 약간만 손실
    };
    const userData = {
        lastLoginTime: NOW - 100 * SECOND,
        tribeId: 'totemB',
        tribeColor: 0x00ff00,
    };
    const diff = calculateCatchUp(userData, blocks, NOW, MY_ID);
    assert.equal(diff.tribeId, 'totemB');
    assert.equal(diff.tribeColor, 0x00ff00);
});

/** 60초 미만 오프라인 → 토스트 없음. */
test('토스트: 60초 미만 → null', () => {
    const userData = { lastLoginTime: NOW - 30 * SECOND };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.equal(diff.toastMessage, null);
});

/** 60초 이상 → 토스트 존재. */
test('토스트: 60초 이상 → 메시지 존재', () => {
    const userData = { lastLoginTime: NOW - 120 * SECOND };
    const diff = calculateCatchUp(userData, {}, NOW, MY_ID);
    assert.ok(typeof diff.toastMessage === 'string');
    assert.ok(diff.toastMessage.includes('흘렀습니다'));
});

/** 펫 도망 토스트는 이전에 펫이 있었을 때만 표시. */
test('토스트: 펫 도망 메시지 — 이전 petType 있을 때만', () => {
    const needSec = PET_HUNGER_MAX / PET_HUNGER_PER_SEC / OFFLINE_RATE + 100;
    const userDataWithPet = { lastLoginTime: NOW - needSec * SECOND, petType: 'koala', petHunger: 0 };
    const diff1 = calculateCatchUp(userDataWithPet, {}, NOW, MY_ID);
    assert.ok(diff1.toastMessage.includes('펫이 도망쳤습니다'));

    const userDataNoPet = { lastLoginTime: NOW - needSec * SECOND, petType: null, petHunger: 0 };
    const diff2 = calculateCatchUp(userDataNoPet, {}, NOW, MY_ID);
    assert.ok(!diff2.toastMessage.includes('펫이 도망쳤습니다'));
});

/** petHunger는 항상 PET_HUNGER_MAX 이하로 clamp. */
test('petHunger 항상 ≤ PET_HUNGER_MAX', () => {
    // 매우 긴 오프라인 + 알 수 없는 펫 종류 (clamp 미통과로 누적되지 않지만, 안전성 보장 확인)
    const huge = { lastLoginTime: NOW - 999999 * SECOND, petType: 'koala', petHunger: 0 };
    const diff = calculateCatchUp(huge, {}, NOW, MY_ID);
    assert.ok(diff.petHunger <= PET_HUNGER_MAX);
});

/** null/undefined userData/blocks 방어. */
test('null userData/blocks 입력 → 안전하게 빈 결과', () => {
    const diff = calculateCatchUp(null, null, NOW, MY_ID);
    assert.equal(diff.offlineSeconds, 0);
    assert.deepEqual(diff.totemActions, []);
    assert.equal(diff.toastMessage, null);
});
