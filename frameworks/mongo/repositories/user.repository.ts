import type {
  GetUserRepositoryParams, UpdateUserRepositoryParams, UserRepository,
} from '@fishprovider/application-rules';
import { type User, UserError } from '@fishprovider/enterprise-rules';

import { mongo } from '../mongo.framework';

async function getUser(params: GetUserRepositoryParams) {
  const { userId, projection } = params;
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne({
    _id: userId,
  }, {
    projection,
  });
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  return user;
}

async function updateUser(params: UpdateUserRepositoryParams) {
  const { userId, payload } = params;
  const { db } = await mongo.get();
  await db.collection<User>('news').updateOne({
    _id: userId,
  }, {
    $set: payload,
  });
  return true;
}

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
