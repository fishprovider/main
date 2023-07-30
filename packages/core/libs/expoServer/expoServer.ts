import type { User } from '@fishprovider/utils/dist/types/User.model';
import { Expo } from 'expo-server-sdk';
import _ from 'lodash';

const expo = new Expo({ accessToken: process.env.EXPO_TOKEN });

const getPushTokens = async (topic: string) => {
  const users = await Mongo.collection<User>('users').find({
    'pushNotif.type': 'expo',
    ...(topic === 'allDevices' ? {} : {
      'pushNotif.topic': topic,
    }),
  }, {
    projection: {
      'pushNotif.token': 1,
    },
  }).toArray();
  return _.flatMap(users, (item) => item.pushNotif)
    .filter((item) => item && item.type === 'expo' && (
      item.topic === 'allDevices' || item.topic === topic
    ))
    .map((item) => item?.token || '');
};

const push = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
) => {
  const pushTokens = await getPushTokens(topic);

  const messages = pushTokens.map((to) => ({
    to,
    ...notification,
  }));

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      Logger.error('Failed to send ExpoPushNotif', error);
    }
  }
};

export { push };
