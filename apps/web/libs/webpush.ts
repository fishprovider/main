import { apiPost } from '@fishbot/cross/libs/api';
import promiseCreator from '@fishbot/utils/helpers/promiseCreator';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const env = {
  fcmVapidKey: process.env.NEXT_PUBLIC_FIREBASE_CLOUD_MESSAGING_VAPID_KEY,
};

let fcmToken: string;
const fcmTokenPromise = promiseCreator();

const requestNotif = () => {
  if (!('Notification' in window)) {
    Logger.info('Browser does not support Notification');
    return Promise.resolve('unsupported');
  }
  return Notification.requestPermission();
};

const initPushNotif = async () => {
  if (!('serviceWorker' in navigator)) {
    Logger.info('Browser does not support ServiceWorker');
    return;
  }

  const status = await requestNotif();
  if (status !== 'granted') {
    Logger.info(`User does does allow Notification with status ${status}`);
    return;
  }

  const messaging = getMessaging();
  fcmToken = await getToken(messaging, {
    vapidKey: env.fcmVapidKey,
  });
  fcmTokenPromise.resolveExec();
};

const handleNotif = async (onNotif?: (title: string, body: string) => void) => {
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  Logger.info('PushNotif is ready', serviceWorkerRegistration.active);

  onMessage(getMessaging(), (payload) => {
    console.log('[FG] Message received', payload);
    const { title = '', body = '' } = payload.notification || {};
    if (onNotif) {
      onNotif(title, body);
    } else {
      serviceWorkerRegistration.showNotification(title, { body });
    }
  });
};

const subNotif = async (providerId?: string) => {
  await fcmTokenPromise;
  await apiPost('/subNotif', { fcmToken, providerId });
  apiPost('/cleanNotif');
};

const unsubNotif = async (providerId?: string) => {
  await fcmTokenPromise;
  await apiPost('/unsubNotif', { fcmToken, providerId });
};

const pushNotif = async (title: string, body: string) => {
  await fcmTokenPromise;
  await apiPost('/pushNotif', { title, body });
};

export {
  handleNotif,
  initPushNotif, pushNotif, requestNotif,
  subNotif, unsubNotif,
};
