
import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AAAAwJXcpf4:APA91bF_qG9uN85C-_jLaNswFudpNCuv7b4YR1MofV3HYOEztyV0x2UEHaxRTSTJGOvKlgObZDaRZj-BxtmSQicj98LW8YTC6_8-IPXvllHzjWVGvm8TgYCCrQIiXiaRB9IXt2hGrxT5",
    authDomain: "ccar-my.firebaseapp.com",
    databaseURL: "https://ccar-my.firebaseio.com",
    projectId: "ccar-my",
    storageBucket: "ccar-my.appspot.com",
    messagingSenderId: "827147986430",
    appId: "1:827147986430:web:9b41b5e04dafd307f98caf",
    measurementId: "G-L8NHNSDC47"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app(); // if already initialized, use that one
 }

export default firebase;