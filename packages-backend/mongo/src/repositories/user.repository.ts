import { User, UserRoles } from '@fishprovider/core';
import { BaseGetOptions, BaseUpdateOptions, UserRepository } from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildUserFilter = (filter: {
  email?: string,
  pushNotifType?: string
  pushNotifTopic?: string
}): Filter<User> => {
  const {
    email, pushNotifType, pushNotifTopic,
  } = filter;
  return {
    ...(email && { email }),
    ...(pushNotifType && {
      pushNotif: {
        $elemMatch: {
          type: pushNotifType,
          topic: pushNotifTopic,
        },
      },
    }),
  };
};

const getUser = async (
  filter: {
    email?: string,
  },
  options?: BaseGetOptions<User>,
) => {
  const { db } = await getMongo();
  const user = await db.collection<User>('users').findOne(
    buildUserFilter(filter),
    options,
  );
  return { doc: user ?? undefined };
};

const getUsers = async (
  filter: {
    pushNotifType?: string
    pushNotifTopic?: string
  },
  options?: BaseGetOptions<User>,
) => {
  const { db } = await getMongo();
  const users = await db.collection<User>('users').find(
    buildUserFilter(filter),
    options,
  ).toArray();
  return { docs: users };
};

const updateUser = async (
  filter: {
    email?: string,
  },
  payload: {
    name?: string
    starAccount?: {
      accountId: string
      enabled: boolean
    }
    roles?: UserRoles
  },
  options?: BaseUpdateOptions<User>,
) => {
  const userFilter = buildUserFilter(filter);

  const {
    name, starAccount, roles,
  } = payload;
  const {
    returnAfter, projection,
  } = options || {};

  const updateFilter: UpdateFilter<User> = {
    $set: {
      ...(name && { name }),
      ...(starAccount && {
        [`starProviders.${starAccount.accountId}`]: starAccount.enabled,
        [`starAccounts.${starAccount.accountId}`]: starAccount.enabled,
      }),
      ...(roles && { roles }),
    },
  };

  const { db } = await getMongo();
  const collection = db.collection<User>('users');

  if (returnAfter) {
    const user = await collection.findOneAndUpdate(
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
  getUsers,
  updateUser,
};
