import { pushExpo } from '@fishprovider/expo';
import { pushFirebase } from '@fishprovider/firebase';

export const pushNotif = async (
  notification: { title: string, body: string },
  topic: string = 'allDevices',
  pushTokens: string[] = [],
) => {
  await Promise.all([
    pushFirebase(notification, topic),
    pushExpo(notification, pushTokens),
  ]);
};
