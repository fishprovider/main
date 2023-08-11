import {
  DefaultUserRepository,
  type GetUserRepositoryParams, type UpdateUserRepositoryParams, type UserRepository,
} from '@fishprovider/application';
import type { User } from '@fishprovider/enterprise';
import assert from 'assert';

import { mongo } from '../mongo.framework';

const getUser = async (params: GetUserRepositoryParams) => {
  const { userId, projection } = params;
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne({
    _id: userId,
  }, {
    projection,
  });
  return user;
};

const updateUser = async (params: UpdateUserRepositoryParams) => {
  const {
    userId, email, payload, payloadDelete,
  } = params;
  assert(userId || email);
  assert(payload || payloadDelete);

  const { db } = await mongo.get();
  await db.collection<User>('users').updateOne({
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
};

export const MongoUserRepository: UserRepository = {
  ...DefaultUserRepository,
  getUser,
  updateUser,
};
