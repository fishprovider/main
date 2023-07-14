import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import crypto from 'crypto';
import _ from 'lodash';

const env = {
  telegramToken: process.env.TELEGRAM_VERIFY_TOKEN || '',
};

interface TelegramLoginPayload {
  id: number;
  hash: string;
  auth_date: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}

function validateTelegramPayload(payload: TelegramLoginPayload) {
  const tokenSecret = crypto.createHash('sha256').update(env.telegramToken).digest();
  const res = crypto.createHmac('sha256', tokenSecret).update(
    _.map(_.omit(payload, 'hash'), (value, key) => `${key}=${value}`).sort().join('\n'),
  ).digest('hex');
  return payload.hash === res;
}

const accountTelegramAuth = async ({ data, userInfo }: {
  data: TelegramLoginPayload,
  userInfo: User,
}) => {
  const {
    id, hash, username, auth_date,
  } = data;
  if (!id || !hash) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  const isValid = validateTelegramPayload(data);
  if (!isValid) {
    return { error: ErrorType.userNotFound };
  }

  const user = await Mongo.collection<User>('users').findOne({
    'telegram.userId': id,
  }, {
    projection: {
      _id: 1,
    },
  });
  if (user) {
    if (user._id === uid) {
      return { result: true };
    }
    return { error: 'Your Telegram is already linked to another user' };
  }

  await Mongo.collection<User>('users').updateOne({
    _id: uid,
  }, {
    $set: {
      'telegram.userId': id,
      'telegram.userName': username,
      'telegram.authDate': auth_date,
    },
  });

  return { result: true };
};

export default accountTelegramAuth;
