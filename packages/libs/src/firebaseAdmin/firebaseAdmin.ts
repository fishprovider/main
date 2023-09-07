import admin from 'firebase-admin';

import { log } from '..';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
});

firebaseApp.firestore().settings({
  ignoreUndefinedProperties: true,
});

// const getToken = async () => {
//   if (!process.env.FIREBASE_ADMIN_UID || !process.env.FIREBASE_CLIENT_API_KEY) {
//     Logger.warn('Failed to get token: params error');
//     return null;
//   }

//   const customToken = await _firebase.auth().createCustomToken(process.env.FIREBASE_ADMIN_UID);

//   const res = await axios.post(
//     `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_CLIENT_API_KEY}`,
//     { token: customToken, returnSecureToken: true },
//   );

//   return res.data.idToken;
// };

// const getBucket = () => admin.storage().bucket();

// const uploadFile = async (pathString, uploadOptions) => {
//   const bucket = admin.storage().bucket();
//   const result = await bucket.upload(pathString, uploadOptions);
//   return result;
// };

// const getInfo = async (fcmToken: string) => {
//   const url = `https://iid.googleapis.com/iid/info/${fcmToken}?details=true`;
//   const { data } = await axios.get(url, {
//     headers: {
//       Authorization: `key=${process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY}`,
//     },
//   });
//   log.debug(`getInfo: ${JSON.stringify(data)}`);
//   return data;
// };

export const pushFirebase = async (
  notification: { title: string, body: string },
  topic: string,
) => {
  const message = {
    notification,
    topic,
  };
  await firebaseApp?.messaging().send(message).catch((error) => {
    log.debug(`Push notif failed ${new Date().toLocaleString()} ${error}`);
  });
};

export const destroyFirebase = async () => {
  console.log('Firebase destroying...');
  await firebaseApp.delete();
  console.log('Firebase destroyed');
};
