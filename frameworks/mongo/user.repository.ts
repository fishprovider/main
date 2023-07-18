import type { GetUserRepositoryParams, UpdateUserRepositoryParams, UserRepository } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { UserError } from '@fishprovider/enterprise-rules';

import { mongo } from './mongo';

export const MongoUserRepository: UserRepository = {
  getUser: async (params: GetUserRepositoryParams) => {
    const { db } = await mongo.get();
    const user = await db.collection<User>('users').findOne(params);
    if (!user) {
      throw new Error(UserError.USER_NOT_FOUND);
    }
    return user;
  },
  updateUser: async (params: UpdateUserRepositoryParams) => {
    const { db } = await mongo.get();
    const { _id, payload } = params;
    await db.collection<User>('news').updateOne({
      _id,
    }, {
      $set: payload,
    });
    return true;
  },
};
