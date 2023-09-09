import { log } from '@fishprovider/core-utils';
import admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const app = admin.initializeApp({
  credential: projectId && privateKey && clientEmail
    ? admin.credential.cert({ projectId, privateKey, clientEmail })
    : undefined,
}, 'pushNotif');

const messaging = app.messaging();

export const stopFirebase = async () => {
  log.info('Stopping Firebase pushNotif');
  await app.delete();
  log.info('Stopped Firebase pushNotif');
};

export const subscribeFirebase = async (
  token: string,
  topic: string,
) => messaging.subscribeToTopic(token, topic);

export const unsubscribeFirebase = async (
  token: string,
  topic: string,
) => messaging.unsubscribeFromTopic(token, topic);

export const pushFirebase = async (
  notification: { title: string, body: string },
  topic: string,
) => {
  const message = {
    notification,
    topic,
  };
  await messaging.send(message).catch((error) => {
    log.debug('Failed to pushNotif Firebase', error);
  });
};
