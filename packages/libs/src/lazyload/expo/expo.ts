import { promiseCreator } from '@fishprovider/core-new';
import { Expo } from 'expo-server-sdk';

import { log } from '../..';

const expoPromise = promiseCreator<Expo>();

export const startExpo = () => {
  log.info('Starting Expo');
  const expo = new Expo({ accessToken: process.env.EXPO_TOKEN });
  log.info('Started Expo');
  expoPromise.resolveExec(expo);
};

export const stopExpo = () => {
  log.info('Stopped Expo');
};

const push = async (
  notification: { title: string, body: string },
  pushTokens: string[],
) => {
  const expo = await expoPromise;

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

export const getExpo = async () => {
  const expo = await expoPromise;
  return {
    expo,
    push,
  };
};
