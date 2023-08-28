import {
  AccountRoles,
  type GetUserParams, RepositoryError,
  type UpdateUserParams, type User, type UserRepository,
} from '@fishprovider/core-new';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { mongo } from '../main';

const roleFields = {
  [AccountRoles.admin]: 'adminProviders',
  [AccountRoles.protector]: 'protectorProviders',
  [AccountRoles.trader]: 'traderProviders',
  [AccountRoles.viewer]: 'viewerProviders',
};

const getUser = async (params: GetUserParams) => {
  const { userId, email, projection } = params;
  const { db } = await mongo.get();
  const user = await db.collection<User>('users').findOne({
    ...(userId && { _id: userId }),
    ...(email && { email }),
  }, {
    projection,
  });
  return user;
};

const updateUser = async (params: UpdateUserParams) => {
  const {
    userId, email,
    name, picture, starProvider, addRole, roles,
    returnDoc, projection,
  } = params;

  if (!userId && !email) throw new Error(RepositoryError.REPOSITORY_BAD_RESULT);

  const filter: Filter<User> = {
    ...(userId && { _id: userId }),
    ...(email && { email }),
  };

  const updateFilter: UpdateFilter<User> = {
    $set: {
      ...(name && { name }),
      ...(picture && { picture }),
      ...(roles && { roles }),
      ...(starProvider && {
        [`starProviders.${starProvider.accountId}`]: starProvider.enabled,
      }),
      ...(addRole && {
        [`roles.${roleFields[addRole.role]}.${addRole.accountId}`]: true,
      }),
    },
  };

  const { db } = await mongo.get();
  const collection = db.collection<User>('users');

  if (returnDoc) {
    return collection.findOneAndUpdate(filter, updateFilter, {
      returnDocument: ReturnDocument.AFTER,
      projection,
    });
  }
  await collection.updateOne(filter, updateFilter);
  return {};
};

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
