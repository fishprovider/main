import { AccountRoles, User } from '@fishprovider/core';
import {
  BaseGetOptions, BaseUpdateOptions, GetUserFilter,
  UpdateUserPayload, UserRepository,
} from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const roleFields = {
  [AccountRoles.admin]: 'adminProviders',
  [AccountRoles.protector]: 'protectorProviders',
  [AccountRoles.trader]: 'traderProviders',
  [AccountRoles.viewer]: 'viewerProviders',
};

const buildUserFilter = (filter: GetUserFilter): Filter<User> => {
  const { userId, email } = filter;
  return {
    ...(userId && { _id: userId }),
    ...(email && { email }),
  };
};

const getUser = async (
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
) => {
  const { db } = await getMongo();
  const user = await db.collection<User>('users').findOne(
    buildUserFilter(filter),
    options,
  );
  return { doc: user ?? undefined };
};

const updateUser = async (
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
) => {
  const userFilter = buildUserFilter(filter);

  const {
    name, picture, starProvider, addRole, roles,
  } = payload;
  const {
    returnAfter, projection,
  } = options;

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

  const { db } = await getMongo();
  const collection = db.collection<User>('users');

  if (returnAfter) {
    const { value: user } = await collection.findOneAndUpdate(
      userFilter,
      updateFilter,
      {
        returnDocument: ReturnDocument.AFTER,
        projection,
      },
    );
    return { doc: user ?? undefined };
  }
  await collection.updateOne(userFilter, updateFilter);
  return {};
};

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
