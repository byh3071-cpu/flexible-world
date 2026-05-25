/**
 * OfflineSystem.js — V17 오프라인 시뮬레이션 (부수효과 클래스)
 *
 * 순수 계산은 `./offline.calculations.js`의 `calculateCatchUp` 가 담당.
 * 이 파일은 DB I/O·scene 변형·타이머 등록만.
 */

import { db } from '../net/firebase.js';
import { safeVal, safeNum } from '../utils/safe.js';
import { calculateCatchUp } from './offline.calculations.js';

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
                const now = Date.now();
                const diff = calculateCatchUp(userData, blocksData, now, myId);

                // 토템 변경 DB 반영
                for (const act of diff.totemActions) {
                    if (act.type === 'remove') db.ref('blocks/' + act.key).remove();
                    else db.ref('blocks/' + act.key).update({ hp: act.hp });
                }

                // catchUp 토스트
                if (diff.toastMessage) {
                    scene.time.delayedCall(800, () => scene.showToast('당신이 떠나있는 동안 ' + diff.toastMessage));
                }

                // scene 상태 반영
                scene.myPetHunger = diff.petHunger;
                scene.myTribeId = diff.tribeId;
                scene.myTribeColor = diff.tribeColor;

                // userData 패스스루
                const savedStone = safeNum(userData.stone, 0);
                const savedWood = safeNum(userData.wood, 0);
                const savedCrystal = safeNum(userData.crystal, 0);
                const savedHp = Math.min(100, Math.max(0, safeNum(userData.hp, 100)));

                const playerData = {
                    x: startX, y: startY, nickname: scene.myNickname, color: scene.myColor,
                    hp: savedHp, stone: savedStone, wood: savedWood, crystal: savedCrystal,
                    tribeId: diff.tribeId, tribeColor: diff.tribeColor,
                    reputation: safeNum(userData.reputation, 0),
                    petType: diff.petType, hatType: safeVal(userData.hatType),
                    petHunger: diff.petHunger
                };
                db.ref('players/' + myId).set(playerData);

                db.ref('userData/' + myId).update({
                    lastLoginTime: now,
                    petType: diff.petType, petHunger: diff.petHunger,
                    tribeId: diff.tribeId, tribeColor: diff.tribeColor,
                    stone: playerData.stone, wood: playerData.wood, crystal: playerData.crystal,
                    hp: playerData.hp, reputation: playerData.reputation, hatType: playerData.hatType
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
