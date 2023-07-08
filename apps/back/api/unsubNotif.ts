// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { getInfo } from '@fishprovider/core/libs/firebase';
import { ErrorType } from '@fishprovider/utils/constants/error';
import type { User } from '@fishprovider/utils/types/User.model';
import md5 from 'md5';

const unsubNotif = async ({ data, userInfo }: {
  data: {
    fcmToken: string,
    providerId?: string,
  }
  userInfo: User,
}) => {
  const { fcmToken, providerId } = data;
  if (!fcmToken || !providerId) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const subRes = await Firebase.messaging().unsubscribeFromTopic(fcmToken, `account-${providerId}`);
  Logger.debug('Unsubscribed to topic', subRes);

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

export default unsubNotif;
