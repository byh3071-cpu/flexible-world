/**
 * net/firebase.js — Firebase 초기화 및 db/auth 핸들
 *
 * Firebase SDK는 index.html에서 CDN으로 먼저 로드되어야 한다.
 * 본 모듈은 그 위에 initializeApp을 한 번 수행하고, db와 auth를 export한다.
 */

import { firebaseConfig } from './config.js';

if (typeof firebase === 'undefined') {
    throw new Error("Firebase CDN을 먼저 로드해주세요.");
}
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.error(e);
}

export const db = firebase.database();
export const auth = firebase.auth();
