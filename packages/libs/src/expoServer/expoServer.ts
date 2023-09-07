import { Expo } from 'expo-server-sdk';

import { log } from '..';

let expo: Expo | undefined;

export const startExpo = () => {
  expo = new Expo({ accessToken: process.env.EXPO_TOKEN });
};

export const pushExpo = async (
  notification: { title: string, body: string },
  pushTokens: string[],
) => {
  if (!expo) return;

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
