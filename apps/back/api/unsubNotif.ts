// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const unsubNotif = async ({ data, userInfo }: {
  data: {
    fcmToken: string,
    expoPushToken?: string,
    providerId?: string,
  }
  userInfo: User,
}) => {
  const { fcmToken, expoPushToken, providerId } = data;
  if (!(fcmToken || expoPushToken) || !providerId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const subRes = await Firebase.messaging().unsubscribeFromTopic(fcmToken, `account-${providerId}`);
  Logger.debug('Unsubscribed to topic', subRes);

  if (fcmToken) {
    await Mongo.collection<User>('users').updateOne(
      { _id: uid },
      {
        $set: {
          updatedAt: new Date(),
        },
        $pull: {
          pushNotif: {
            type: 'fcm',
            token: fcmToken,
            topic: `account-${providerId}`,
          },
        },
      },
    );
  }

  if (expoPushToken) {
    await Mongo.collection<User>('users').updateOne(
      { _id: uid },
      {
        $set: {
          updatedAt: new Date(),
        },
        $pull: {
          pushNotif: {
            type: 'expo',
            token: expoPushToken,
            topic: `account-${providerId}`,
          },
        },
      },
    );
  }

  return {};
};

export default unsubNotif;
