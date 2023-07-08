// ref: https://developers.google.com/instance-id/reference/server#get_information_about_app_instances

import { getInfo } from '@fishprovider/core/libs/firebase';
import { ErrorType } from '@fishprovider/utils/constants/error';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { User } from '@fishprovider/utils/types/User.model';
import _ from 'lodash';
import md5 from 'md5';

const cleanNotif = async ({ userInfo }: {
  userInfo: User,
}) => {
  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const user = await Mongo.collection<User>('users').findOne({
    _id: uid,
  }, {
    projection: {
      _id: 1,
      fcmInfo: 1,
    },
  });
  if (!user) {
    return { error: ErrorType.userNotFound };
  }

  const unsub = async (fcmToken: string, topic: string) => {
    if (topic === 'allDevices') return;

    if (topic.startsWith('account-')) {
      const providerId = topic.replace('account-', '');
      const { isViewerProvider } = getRoleProvider(userInfo.roles, providerId);
      if (!isViewerProvider) {
        const subRes = await Firebase.messaging().unsubscribeFromTopic(fcmToken, topic);
        Logger.debug('Unsubscribed to topic', subRes);
      }
      return;
    }

    const subRes = await Firebase.messaging().unsubscribeFromTopic(fcmToken, topic);
    Logger.debug('Unsubscribed to topic', subRes);
  };

  const unsubTopics = async (fcmToken: string, topics: string[]) => {
    for (const topic of topics) {
      try {
        await unsub(fcmToken, topic);

        const infoNew = await getInfo(fcmToken);
        const fcmTokenHash = md5(fcmToken);
        await Mongo.collection<User>('users').updateOne({
          _id: uid,
        }, {
          $set: {
            updatedAt: new Date(),
            [`fcmInfo.${fcmTokenHash}`]: {
              ...infoNew,
              fcmToken,
            },
          },
        });
      } catch (err) {
        Logger.error('[cleanNotif] Failed to unsub', err);
      }
    }
  };

  for (const [key, { fcmToken }] of Object.entries(user.fcmInfo || {})) {
    try {
      const info = await getInfo(fcmToken);
      await unsubTopics(fcmToken, _.keys(info.rel.topics));
    } catch (err) {
      Logger.debug('[cleanNotif] Failed to getInfo', err);
      await Mongo.collection<User>('users').updateOne({
        _id: uid,
      }, {
        $unset: {
          [`fcmInfo.${key}`]: '',
        },
      });
    }
  }

  return {};
};

export default cleanNotif;
