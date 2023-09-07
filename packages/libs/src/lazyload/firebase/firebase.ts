import { promiseCreator } from '@fishprovider/core-new';
import admin from 'firebase-admin';

import { log } from '../..';

const appPromise = promiseCreator<admin.app.App>();

export const startFirebase = () => {
  log.info('Starting Firebase');
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
  app.firestore().settings({
    ignoreUndefinedProperties: true,
  });
  log.info('Started Firebase');
  appPromise.resolveExec(app);
};

export const stopFirebase = async () => {
  log.info('Stopping Firebase');
  const app = await appPromise;
  await app.delete();
  log.info('Stopped Firebase');
};

const push = async (
  notification: { title: string, body: string },
  topic: string,
) => {
  const app = await appPromise;
  const message = {
    notification,
    topic,
  };
  await app.messaging().send(message).catch((error) => {
    log.debug('Failed to push', error);
  });
};

export const getFirebase = async () => {
  const app = await appPromise;
  return {
    app,
    auth: app.auth(),
    db: app.firestore(),
    push,
  };
};
