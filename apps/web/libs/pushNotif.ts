import { apiPost } from '@fishprovider/cross/dist/libs/api';
import promiseCreator from '@fishprovider/utils/dist/helpers/promiseCreator';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const env = {
  fcmVapidKey: process.env.NEXT_PUBLIC_FIREBASE_CLOUD_MESSAGING_VAPID_KEY,
};

const fcmTokenPromise = promiseCreator();

const requestNotif = async () => {
  if (!('serviceWorker' in navigator)) {
    Logger.info('Browser does not support ServiceWorker');
    return 'unsupported';
  }
  if (!('Notification' in window)) {
    Logger.info('Browser does not support Notification');
    return 'unsupported';
  }

  const existingStatus = Notification.permission;
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    finalStatus = await Notification.requestPermission();
  }
  if (finalStatus !== 'granted') {
    Logger.info(`User does does allow Notification with status ${finalStatus}`);
    return finalStatus;
  }

  const messaging = getMessaging();
  const fcmToken = await getToken(messaging, {
    vapidKey: env.fcmVapidKey,
  });
  fcmTokenPromise.resolveExec(fcmToken);

  return finalStatus;
};

const initNotif = async () => {
  await requestNotif();
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
  const fcmToken = await fcmTokenPromise;
  await apiPost('/subNotif', { fcmToken, providerId });
};

const unsubNotif = async (providerId?: string) => {
  const fcmToken = await fcmTokenPromise;
  await apiPost('/unsubNotif', { fcmToken, providerId });
};

const sendNotif = async (title: string, body: string) => {
  await fcmTokenPromise;
  await apiPost('/sendNotif', { title, body });
};

export {
  handleNotif,
  initNotif,
  requestNotif,
  sendNotif,
  subNotif,
  unsubNotif,
};
