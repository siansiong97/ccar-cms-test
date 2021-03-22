
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

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
} else {
     firebase.app(); // if already initialized, use that one
}

const messaging = firebase.messaging();


// messaging.setBackgroundMessageHandler(function (payload) {
//      const promiseChain = clients
//           .matchAll({
//                type: "window",
//                includeUncontrolled: true,
//           })
//           .then((windowClients) => {
//                for (let i = 0; i < windowClients.length; i++) {
//                     const windowClient = windowClients[i];
//                     windowClient.postMessage(payload);
//                }
//           })
//           .then(() => {
//                return registration.showNotification("my notification title");
//           })
//           .catch((err) => {
//                console.log({ err });
//           })

//      return promiseChain;
// });


// self.addEventListener("notificationclick", function (event) {
//      console.log(event);
// });