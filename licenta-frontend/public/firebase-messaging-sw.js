importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.5.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyAVyGKpytHW0OyCPxc6npNmVZfRlU7bMd0",
    authDomain: "licenta-app-7195c.firebaseapp.com",
    projectId: "licenta-app-7195c",
    storageBucket: "licenta-app-7195c.firebasestorage.app",
    messagingSenderId: "232307961431",
    appId: "1:232307961431:web:1c1864630829c92cbcfd12"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    const notificationOptions = {
        body: payload?.data?.body,
        vibrate: [200, 100, 200],
    };

    self.registration.showNotification(payload?.data?.title, notificationOptions).then(r => {});

    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
        for (const client of clients) {
            client.postMessage({
                type: "FCM_BACKGROUND_MESSAGE",
                payload: payload
            });
        }
    });
});