/**
 * OfflineSystem.js — V17 오프라인 시뮬레이션
 *
 * 역할:
 *   1) 게임 진입 시 userData·블록 로드 → 오프라인 catchUp 계산 → players 초기 설정
 *      → onDisconnect / beforeunload / 30초 자동 동기화 등록 (loadAndApply)
 *   2) 부족 변경·펫 변경·자원 변동 등 시점에 userData 즉시 동기화 (syncNow)
 *
 * 의존:
 *   - scene: Phaser.Scene 인스턴스. scene.myId, scene.myNickname, scene.myColor,
 *            scene.my{Stone,Wood,Crystal,Hp,Reputation,PetType,PetHunger,TribeId,
 *            TribeColor,HatType}, scene.time, scene.showToast 사용.
 *   - Firebase: db (RTDB), firebase.database.ServerValue.TIMESTAMP
 */

import { db } from '../net/firebase.js';
import { safeVal, safeNum } from '../utils/safe.js';
import { formatOfflineTime } from '../utils/time.js';
import {
    OFFLINE_RATE, OFFLINE_24H_SEC,
    PET_HUNGER_PER_SEC, PET_HUNGER_MAX, TOTEM_ENTROPY_PER_SEC,
} from '../config/balance.js';

export class OfflineSystem {
    constructor(scene) {
        this.scene = scene;
    }

    /** 게임 진입 시 1회. userData·블록 로드 → catchUp → players 설정 → 자동 동기화 시작. */
    loadAndApply(startX, startY, onDone) {
        const scene = this.scene;
        const myId = scene.myId;
        db.ref('userData/' + myId).once('value', (userSnap) => {
            db.ref('blocks').once('value', (blocksSnap) => {
                const userData = userSnap.val() || {};
                const blocksData = blocksSnap.val() || {};
                const lastLogin = safeNum(userData.lastLoginTime, 0);
                const now = Date.now();
                const offlineSeconds = lastLogin > 0 ? (now - lastLogin) / 1000 : 0;

                let petType = safeVal(userData.petType);
                let petHunger = safeNum(userData.petHunger, 0);
                let tribeId = safeVal(userData.tribeId);
                let tribeColor = safeVal(userData.tribeColor);
                const savedStone = safeNum(userData.stone, 0);
                const savedWood = safeNum(userData.wood, 0);
                const savedCrystal = safeNum(userData.crystal, 0);
                const savedHp = Math.min(100, Math.max(0, safeNum(userData.hp, 100)));

                if (offlineSeconds > 0) {
                    const effectiveSeconds = offlineSeconds * OFFLINE_RATE;
                    const is24hOrMore = offlineSeconds >= OFFLINE_24H_SEC;

                    if (petType && (petType === 'koala' || petType === 'alpaca' || petType === 'gecko')) {
                        petHunger += effectiveSeconds * PET_HUNGER_PER_SEC;
                        if (petHunger >= PET_HUNGER_MAX || is24hOrMore) {
                            petType = null;
                            petHunger = 0;
                        }
                    }

                    const myTotemKeys = Object.keys(blocksData).filter((k) => {
                        const b = blocksData[k];
                        return b && b.type === 'totem' && b.ownerId === myId;
                    });
                    for (const tk of myTotemKeys) {
                        const totem = blocksData[tk];
                        const curHp = safeNum(totem.hp, 10000);
                        const damage = effectiveSeconds * TOTEM_ENTROPY_PER_SEC;
                        const nhp = Math.max(0, curHp - damage);
                        if (nhp <= 0 || is24hOrMore) {
                            db.ref('blocks/' + tk).remove();
                            if (tribeId === tk) { tribeId = null; tribeColor = null; }
                        } else {
                            db.ref('blocks/' + tk).update({ hp: nhp });
                        }
                    }

                    if (offlineSeconds >= 60) {
                        const timeStr = formatOfflineTime(offlineSeconds);
                        const msgs = [];
                        if (petType && petHunger > 20) msgs.push('펫이 배고파합니다!');
                        if (myTotemKeys.length > 0) msgs.push('토템이 시간에 시달립니다.');
                        if (petType === null && userData.petType) msgs.push('펫이 도망쳤습니다.');
                        const msg = msgs.length > 0 ? `${timeStr}이 흘렀습니다. ${msgs.join(' ')}` : `${timeStr}이 흘렀습니다.`;
                        scene.time.delayedCall(800, () => scene.showToast('당신이 떠나있는 동안 ' + msg));
                    }
                }

                scene.myPetHunger = Math.min(PET_HUNGER_MAX, petHunger);
                scene.myTribeId = tribeId;
                scene.myTribeColor = tribeColor;

                const playerData = {
                    x: startX, y: startY, nickname: scene.myNickname, color: scene.myColor,
                    hp: savedHp, stone: savedStone, wood: savedWood, crystal: savedCrystal,
                    tribeId, tribeColor, reputation: safeNum(userData.reputation, 0),
                    petType, hatType: safeVal(userData.hatType), petHunger: scene.myPetHunger
                };
                db.ref('players/' + myId).set(playerData);

                db.ref('userData/' + myId).update({
                    lastLoginTime: now, petType, petHunger: scene.myPetHunger, tribeId, tribeColor,
                    stone: playerData.stone, wood: playerData.wood, crystal: playerData.crystal, hp: playerData.hp, reputation: playerData.reputation, hatType: playerData.hatType
                });
                db.ref('userData/' + myId).onDisconnect().update({
                    lastLoginTime: firebase.database.ServerValue.TIMESTAMP
                });

                const saveOnLeave = () => {
                    db.ref('userData/' + myId).update({
                        lastLoginTime: Date.now(),
                        petType: scene.myPetType,
                        petHunger: scene.myPetHunger,
                        tribeId: scene.myTribeId,
                        tribeColor: scene.myTribeColor,
                        stone: scene.myStone,
                        wood: scene.myWood,
                        crystal: scene.myCrystal,
                        hp: scene.myHp,
                        reputation: scene.myReputation,
                        hatType: scene.myHatType
                    });
                };
                window.addEventListener('beforeunload', saveOnLeave);

                db.ref('players/' + myId).onDisconnect().remove();

                /* 30초마다 userData 동기화 (크래시 시 데이터 손실 완화) */
                scene.time.addEvent({ delay: 30000, loop: true, callback: () => this.syncNow() });

                onDone();
            });
        });
    }

    /** userData 즉시 동기화. overrides로 일부 필드 덮어쓰기 가능. */
    syncNow(overrides = {}) {
        const scene = this.scene;
        db.ref('userData/' + scene.myId).update({
            petType: overrides.petType ?? scene.myPetType,
            petHunger: overrides.petHunger ?? scene.myPetHunger,
            tribeId: overrides.tribeId ?? scene.myTribeId,
            tribeColor: overrides.tribeColor ?? scene.myTribeColor,
            stone: overrides.stone ?? scene.myStone,
            wood: overrides.wood ?? scene.myWood,
            crystal: overrides.crystal ?? scene.myCrystal,
            hp: overrides.hp ?? scene.myHp,
            reputation: overrides.reputation ?? scene.myReputation,
            hatType: overrides.hatType ?? scene.myHatType
        });
    }
}
