// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { getInfo } from '@fishbot/core/libs/firebase';
import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { User } from '@fishbot/utils/types/User.model';
import md5 from 'md5';

const subNotif = async ({ data, userInfo }: {
  data: {
    fcmToken: string,
    providerId?: string,
  }
  userInfo: User,
}) => {
  const { fcmToken, providerId } = data;
  if (!fcmToken) {
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

  if (providerId) {
    const subRes = await Firebase.messaging().subscribeToTopic(fcmToken, `account-${providerId}`);
    Logger.debug('Subscribed to topic', subRes);
  } else {
    const subRes = await Firebase.messaging().subscribeToTopic(fcmToken, 'allDevices');
    Logger.debug('Subscribed to topic', subRes);
  }

  const info = await getInfo(fcmToken);
  const fcmTokenHash = md5(fcmToken);
  await Mongo.collection<User>('users').updateOne(
    {
      _id: uid,
    },
    {
      $set: {
        updatedAt: new Date(),
        [`fcmInfo.${fcmTokenHash}`]: {
          ...info,
          fcmToken,
        },
      },
    },
  );

  return {};
};

export default subNotif;
