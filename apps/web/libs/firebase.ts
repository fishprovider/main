import { initializeApp } from 'firebase/app';

const env = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_API_KEY,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_MEASUREMENT_ID,
};

const initFirebase = () => {
  const config = {
    apiKey: env.apiKey,
    authDomain: `${env.projectId}.firebaseapp.com`,
    databaseURL: `https://${env.projectId}.firebaseio.com`,
    projectId: env.projectId,
    storageBucket: `${env.projectId}.appspot.com`,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
    measurementId: env.measurementId,
  };

  initializeApp(config);

  // TODO: add server: analytics, perf monitor
  // https://firebase.google.com/docs/web/setup#available-services
};

export {
  initFirebase,
};
