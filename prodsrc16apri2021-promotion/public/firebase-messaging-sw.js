
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
     apiKey: "AIzaSyAWx6kjj-4Arrff7fcQPNaMIXuw44hgups",
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
} else {
     firebase.app(); // if already initialized, use that one
}

const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler((payload) => {
     console.log('[firebase-messaging-sw.js] Received background message ', payload);
     // Customize notification here
     const notificationTitle = 'Background Message Title';
     const notificationOptions = {
          body: 'Background Message body.',
          icon: '/firebase-logo.png'
     };

     console.log(self.registration);

     return self.registration.showNotification(notificationTitle, notificationOptions);
});

// self.addEventListener("notificationclick", function (event) {
//      console.log(event);
// });