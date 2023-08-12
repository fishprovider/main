// https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js

/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDoQYfmz1H8tzjv-nMLln84oeqvdFDjVT4',
  authDomain: 'fishprovider-official.firebaseapp.com',
  projectId: 'fishprovider-official',
  storageBucket: 'fishprovider-official.appspot.com',
  messagingSenderId: '130013915084',
  appId: '1:130013915084:web:ba10a1d2c7d68ae7dbdf69',
  measurementId: 'G-97X9XNMNEV',
});

firebase.messaging();

firebase.messaging().onBackgroundMessage((payload) => {
  console.log('[BG] Message received', payload);
  const { title, body } = payload.notification;
  const options = { body, icon: '/logo.png' };
  registration.showNotification(title, options);
});
