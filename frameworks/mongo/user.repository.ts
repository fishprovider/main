import type {
  GetUserRepositoryParams, Projection, UpdateUserRepositoryParams, UserRepository,
} from '@fishprovider/application-rules';
import { User, UserError } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo.framework';

async function getUser(
  params: GetUserRepositoryParams,
  projection?: Projection<User>,
) {
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne(
    params,
    {
      projection,
    },
  );
  if (!user) {
    throw new Error(UserError.USER_NOT_FOUND);
  }
  return user;
}

async function updateUser(
  params: UpdateUserRepositoryParams,
) {
  const { db } = await mongo.get();
  const { _id, payload } = params;
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
