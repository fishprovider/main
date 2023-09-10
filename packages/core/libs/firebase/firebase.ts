import axios from 'axios';
import admin from 'firebase-admin';

const env = {
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  serverKey: process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY,
};

let _firebase: admin.app.App | undefined;

const start = async () => {
  _firebase = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.projectId,
      privateKey: env.privateKey,
      clientEmail: env.clientEmail,
    }),
    databaseURL: `https://${env.projectId}.firebaseio.com`,
    storageBucket: `${env.projectId}.appspot.com`,
  }, 'old-database');
  _firebase.firestore().settings({
    ignoreUndefinedProperties: true,
  });

  global.Firebase = _firebase;
};

const destroy = () => {
  console.log('Firebase destroying...');
  if (_firebase) {
    _firebase.delete();
    _firebase = undefined;
  }
  console.log('Firebase destroyed');
};

const destroyAsync = async () => {
  console.log('Firebase destroying...');
  if (_firebase) {
    await _firebase.delete();
    _firebase = undefined;
  }
  console.log('Firebase destroyed');
};

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

const push = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
) => {
  const message = {
    notification,
    topic,
  };
  await Firebase.messaging().send(message).catch((error) => {
    Logger.debug(`Push notif failed ${new Date().toLocaleString()} ${error}`);
  });
};

const getInfo = async (fcmToken: string) => {
  const url = `https://iid.googleapis.com/iid/info/${fcmToken}?details=true`;
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `key=${env.serverKey}`,
    },
  });
  Logger.debug(`getInfo: ${JSON.stringify(data)}`);
  return data;
};

export {
  destroy, destroyAsync, getInfo, push, start,
};
