import { log, promiseCreator } from '@fishprovider/core-utils';
import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const appPromise = promiseCreator<admin.app.App>();

export const startFirebase = () => {
  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Require FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
  }
  log.info('Starting Firebase');
  const app = admin.initializeApp({
    credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
  }, 'fishprovider');
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

export const getFirebase = async () => {
  const app = await appPromise;
  return {
    app,
    auth: app.auth(),
    db: app.firestore(),
  };
};

export const subscribeFirebase = async (
  token: string,
  topic: string,
) => {
  const app = await appPromise;
  app.messaging().subscribeToTopic(token, topic);
};

export const unsubscribeFirebase = async (
  token: string,
  topic: string,
) => {
  const app = await appPromise;
  app.messaging().unsubscribeFromTopic(token, topic);
};

export const pushFirebase = async (
  notification: { title: string, body: string },
  topic: string,
) => {
  const app = await appPromise;
  const message = {
    notification,
    topic,
  };
  await app.messaging().send(message).catch((error) => {
    log.debug('Failed to pushNotif Firebase', error);
  });
};
