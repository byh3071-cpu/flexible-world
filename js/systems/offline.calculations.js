/**
 * offline.calculations.js — OfflineSystem의 순수 계산 부분
 *
 * 이 모듈은 Firebase·Phaser·DOM 등 외부 의존이 **없다**.
 * 따라서 Node에서 단위 테스트 가능 (`node --test tests/`).
 *
 * 부수효과를 가지는 부분(DB 쓰기·scene 변형)은 OfflineSystem 클래스에서 처리.
 */

import { safeVal, safeNum } from '../utils/safe.js';
import { formatOfflineTime } from '../utils/time.js';
import {
    OFFLINE_RATE, OFFLINE_24H_SEC,
    PET_HUNGER_PER_SEC, PET_HUNGER_MAX, TOTEM_ENTROPY_PER_SEC,
} from '../config/balance.js';

const PET_KINDS = new Set(['koala', 'alpaca', 'gecko']);

/**
 * 오프라인 시간 동안 적용될 변경을 계산한다. **부수효과 없음.**
 *
 * @param {object} userData - RTDB userData/{myId} 원본 (null 허용)
 * @param {object} blocksData - RTDB blocks/ 원본 (null 허용)
 * @param {number} now - Date.now()
 * @param {string} myId - 본인 uid
 * @returns {{
 *   offlineSeconds: number,
 *   petType: string|null,
 *   petHunger: number,
 *   tribeId: string|null,
 *   tribeColor: number|null,
 *   totemActions: Array<{key: string, type: 'remove'} | {key: string, type: 'update', hp: number}>,
 *   toastMessage: string|null
 * }}
 */
export function calculateCatchUp(userData, blocksData, now, myId) {
    const u = userData || {};
    const blocks = blocksData || {};
    const lastLogin = safeNum(u.lastLoginTime, 0);
    const offlineSeconds = lastLogin > 0 ? (now - lastLogin) / 1000 : 0;

    let petType = safeVal(u.petType);
    let petHunger = safeNum(u.petHunger, 0);
    let tribeId = safeVal(u.tribeId);
    let tribeColor = safeVal(u.tribeColor);
    const totemActions = [];
    let toastMessage = null;

    if (offlineSeconds > 0) {
        const effectiveSeconds = offlineSeconds * OFFLINE_RATE;
        const is24hOrMore = offlineSeconds >= OFFLINE_24H_SEC;

        if (petType && PET_KINDS.has(petType)) {
            petHunger += effectiveSeconds * PET_HUNGER_PER_SEC;
            if (petHunger >= PET_HUNGER_MAX || is24hOrMore) {
                petType = null;
                petHunger = 0;
            }
        }

        const myTotemKeys = Object.keys(blocks).filter((k) => {
            const b = blocks[k];
            return b && b.type === 'totem' && b.ownerId === myId;
        });
        for (const tk of myTotemKeys) {
            const totem = blocks[tk];
            const curHp = safeNum(totem.hp, 10000);
            const damage = effectiveSeconds * TOTEM_ENTROPY_PER_SEC;
            const nhp = Math.max(0, curHp - damage);
            if (nhp <= 0 || is24hOrMore) {
                totemActions.push({ key: tk, type: 'remove' });
                if (tribeId === tk) { tribeId = null; tribeColor = null; }
            } else {
                totemActions.push({ key: tk, type: 'update', hp: nhp });
            }
        }

        if (offlineSeconds >= 60) {
            const timeStr = formatOfflineTime(offlineSeconds);
            const msgs = [];
            if (petType && petHunger > 20) msgs.push('펫이 배고파합니다!');
            if (myTotemKeys.length > 0) msgs.push('토템이 시간에 시달립니다.');
            if (petType === null && u.petType) msgs.push('펫이 도망쳤습니다.');
            toastMessage = msgs.length > 0
                ? `${timeStr}이 흘렀습니다. ${msgs.join(' ')}`
                : `${timeStr}이 흘렀습니다.`;
        }
    }

    petHunger = Math.min(PET_HUNGER_MAX, petHunger);

    return { offlineSeconds, petType, petHunger, tribeId, tribeColor, totemActions, toastMessage };
}
