// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { getInfo } from '@fishprovider/core/dist/libs/firebase';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const subNotif = async ({ data, userInfo }: {
  data: {
    fcmToken?: string,
    expoPushToken?: string,
    providerId?: string,
  }
  userInfo: User,
}) => {
  const { fcmToken, expoPushToken, providerId } = data;
  if (!(fcmToken || expoPushToken)) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  if (providerId) {
    const { isViewerProvider } = getRoleProvider(userInfo.roles, providerId);
    if (!isViewerProvider) {
      return { error: ErrorType.accessDenied };
    }
  }

  const topic = providerId ? `account-${providerId}` : 'allDevices';

  if (fcmToken) {
    const subRes = await Firebase.messaging().subscribeToTopic(fcmToken, topic);
    Logger.debug('Subscribed to topic', subRes);
    const fcmInfo = await getInfo(fcmToken);

    const doc = await Mongo.collection<User>('users').findOne(
      {
        _id: uid,
        'pushNotif.type': 'fcm',
        'pushNotif.token': fcmToken,
        'pushNotif.topic': topic,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    if (!doc) {
      await Mongo.collection<User>('users').updateOne(
        { _id: uid },
        {
          $set: {
            updatedAt: new Date(),
          },
          $push: {
            pushNotif: {
              type: 'fcm',
              token: fcmToken,
              topic,
              data: fcmInfo,
            },
          },
        },
      );
    }
  }

  if (expoPushToken) {
    const doc = await Mongo.collection<User>('users').findOne(
      {
        _id: uid,
        'pushNotif.type': 'expo',
        'pushNotif.token': expoPushToken,
        'pushNotif.topic': topic,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    if (!doc) {
      await Mongo.collection<User>('users').updateOne(
        { _id: uid },
        {
          $set: {
            updatedAt: new Date(),
          },
          $push: {
            pushNotif: {
              type: 'expo',
              token: expoPushToken,
              topic,
            },
          },
        },
      );
    }
  }

  return {};
};

export default subNotif;
