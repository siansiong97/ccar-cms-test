
import firebase from 'firebase/app';
import 'firebase/messaging';
import localforage from 'localforage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBNkd-inUJRLD_ke7pwJg66LND8M2e9A_s",
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
}
export const tokenInlocalforage = async () => {
    return localforage.getItem('fcm_token');
}


export const initFirebaseToken = async () => {
    try {
        const messaging = firebase.messaging();
        console.log(firebase);
        const tokenInLocalForage = await tokenInlocalforage();
        //if FCM token is already there just return the token
        if (tokenInLocalForage !== null) {
            return tokenInLocalForage;
        }
        //requesting notification permission from browser
        const status = await Notification.requestPermission();
        console.log('status',status);
        if (status && status === 'granted') {
            //getting token from FCM
            const fcm_token = await messaging.getToken();
            if (fcm_token) {
                //setting FCM token in indexed db using localforage
                localforage.setItem('fcm_token', fcm_token);
                //return the FCM token after saving it
                return fcm_token;
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const onMessageListener = () => {

    const messaging = firebase.messaging();
    return new Promise((resolve) => {
        messaging.onMessage((payload) => {
            console.log('payload', payload);
            resolve(payload);
        });
    });
}
