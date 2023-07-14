// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { getInfo } from '@fishprovider/core/dist/libs/firebase';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import md5 from 'md5';

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

  if (fcmToken) {
    if (providerId) {
      const subRes = await Firebase.messaging().subscribeToTopic(fcmToken, `account-${providerId}`);
      Logger.debug('Subscribed to topic', subRes);
    } else {
      const subRes = await Firebase.messaging().subscribeToTopic(fcmToken, 'allDevices');
      Logger.debug('Subscribed to topic', subRes);
    }
    const info = await getInfo(fcmToken);
    const tokenHash = md5(fcmToken);
    await Mongo.collection<User>('users').updateOne(
      { _id: uid },
      {
        $set: {
          updatedAt: new Date(),
          [`fcmInfo.${tokenHash}`]: {
            ...info,
            fcmToken,
          },
        },
      },
    );
  }

  if (expoPushToken) {
    const tokenHash = md5(expoPushToken);
    await Mongo.collection<User>('users').updateOne(
      { _id: uid },
      {
        $set: {
          updatedAt: new Date(),
          [`expoInfo.${tokenHash}`]: {
            providerId,
            fcmToken,
          },
        },
      },
    );
  }

  return {};
};

export default subNotif;
