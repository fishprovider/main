import { log } from '@fishprovider/core-utils';
import { Expo } from 'expo-server-sdk';

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
    await expo.sendPushNotificationsAsync(chunk).catch((error) => {
      log.error('Failed to pushNotif Expo', error);
    });
  }
};
