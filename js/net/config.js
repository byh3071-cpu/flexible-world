/**
 * net/config.js — Firebase 프로젝트 설정
 *
 * ⚠️ apiKey는 클라이언트 측 공개 키임 (Firebase 도메인 제한으로 보호).
 * 어뷰징 방지는 Authorized domains + database.rules.json + Anonymous Auth 조합으로.
 * 상세는 docs/audits/SECURITY_AUDIT.md.
 */

export const firebaseConfig = {
    apiKey: "AIzaSyCSV10roV3mPluGBCONZwx47uULzC5sObE",
    authDomain: "flexible-world.firebaseapp.com",
    databaseURL: "https://flexible-world-default-rtdb.firebaseio.com",
    projectId: "flexible-world",
    storageBucket: "flexible-world.firebasestorage.app",
    messagingSenderId: "487090083126",
    appId: "1487090083126web3dc40b5bff63e8d6140f97"
};
