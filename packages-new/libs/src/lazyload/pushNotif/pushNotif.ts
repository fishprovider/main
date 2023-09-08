import { getExpo, getFirebase } from '..';

export const pushNotif = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
  expoPushTokens: string[] = [],
) => {
  await Promise.all([
    getFirebase().then((firebase) => firebase.push(notification, topic)),
    getExpo().then((expo) => expo.push(notification, expoPushTokens)),
  ]);
};
