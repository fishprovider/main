import { Expo } from 'expo-server-sdk';

import { log } from '..';

const expo = new Expo({ accessToken: process.env.EXPO_TOKEN });

export const pushExpo = async (
  notification: { title: string, body: string },
  pushTokens: string[],
) => {
  const messages = pushTokens.map((to) => ({
    to,
    ...notification,
  }));

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      log.error('Failed to send ExpoPushNotif', error);
    }
  }
};
