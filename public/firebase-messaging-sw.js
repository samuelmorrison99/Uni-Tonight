importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCHdrcCm2Jc4Q0WVC8BJV22oXhS5-kf7CM",
  authDomain: "unitonight-c8c75.firebaseapp.com",
  projectId: "unitonight-c8c75",
  storageBucket: "unitonight-c8c75.firebasestorage.app",
  messagingSenderId: "695352190062",
  appId: "1:695352190062:web:66d5fa481cd66030a1b27f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
