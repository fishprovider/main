import type {
  GetUserRepositoryParams, UpdateUserRepositoryParams, UserRepository,
} from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import assert from 'assert';

import { mongo } from '../mongo.framework';

async function getUser(params: GetUserRepositoryParams) {
  const { userId, projection } = params;
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne({
    _id: userId,
  }, {
    projection,
  });
  return user;
}

async function updateUser(params: UpdateUserRepositoryParams) {
  const {
    userId, email, payload, payloadDelete,
  } = params;
  assert(userId || email);
  assert(payload || payloadDelete);

  const { db } = await mongo.get();
  await db.collection<User>('news').updateOne({
    ...(userId && { _id: userId }),
    ...(email && { email }),
  }, {
    ...(payload && {
      $set: payload,
    }),
    ...(payloadDelete && {
      $unset: payloadDelete,
    }),
  });
  return true;
}

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
