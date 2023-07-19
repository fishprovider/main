import type {
  GetUserRepositoryParams, UpdateUserRepositoryParams, UserRepository,
} from '@fishprovider/application-rules';
import { User, UserError } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo.framework';

async function getUser(params: GetUserRepositoryParams) {
  const { _id, projection } = params;
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne({
    _id,
  }, {
    projection,
  });
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  return user;
}

async function updateUser(params: UpdateUserRepositoryParams) {
  const { _id, payload } = params;
  const { db } = await mongo.get();
  await db.collection<User>('news').updateOne({
    _id,
  }, {
    $set: payload,
  });
  return true;
}

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
