import { pushExpo, pushFirebase } from '..';

export const pushNotif = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
  expoPushTokens: string[] = [],
) => {
  await Promise.all([
    pushFirebase(notification, topic),
    pushExpo(notification, expoPushTokens),
  ]);
};
