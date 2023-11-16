import { AccountRole, User } from '@fishprovider/core';
import {
  UserRepository,
} from '@fishprovider/core-backend';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildUserFilter = (filter: {
  email?: string,
  emails?: string[],
  pushNotifType?: string
  pushNotifTopic?: string
  roleAccountId?: string,
}): Filter<User> => {
  const {
    email, emails, pushNotifType, pushNotifTopic, roleAccountId,
  } = filter;

  const andFilter: Filter<User>['$and'] = [];

  if (roleAccountId) {
    andFilter.push({
      $or: [
        { [`roles.adminAccounts.${roleAccountId}`]: { $exists: true } },
        { [`roles.protectorAccounts.${roleAccountId}`]: { $exists: true } },
        { [`roles.traderAccounts.${roleAccountId}`]: { $exists: true } },
        { [`roles.viewerAccounts.${roleAccountId}`]: { $exists: true } },
      ],
    });
  }

  return {
    ...(email && { email }),
    ...(emails && { email: { $in: emails } }),
    ...(pushNotifType && {
      pushNotif: {
        $elemMatch: {
          type: pushNotifType,
          topic: pushNotifTopic,
        },
      },
    }),
    ...(andFilter.length && { $and: andFilter }),
  };
};

const getUser: UserRepository['getUser'] = async (filter, options) => {
  const { db } = await getMongo();
  const user = await db.collection<User>('users').findOne(
    buildUserFilter(filter),
    options,
  );
  return { doc: user ?? undefined };
};

const getUsers: UserRepository['getUsers'] = async (filter, options) => {
  const { db } = await getMongo();
  const users = await db.collection<User>('users').find(
    buildUserFilter(filter),
    options,
  ).toArray();
  return { docs: users };
};

const updateUser: UserRepository['updateUser'] = async (filter, payload, options) => {
  const userFilter = buildUserFilter(filter);

  const {
    starAccount, roles, addRole, removeRole,
  } = payload;
  const {
    returnAfter, projection,
  } = options || {};

  const updateFilter: UpdateFilter<User> = {
    $set: {
      ...(starAccount && {
        [`starAccounts.${starAccount.accountId}`]: starAccount.enabled,
      }),
      ...(roles && { roles }),
      ...(addRole?.role === AccountRole.admin && {
        [`roles.adminAccounts.${addRole.accountId}`]: true,
      }),
      ...(addRole?.role === AccountRole.protector && {
        [`roles.protectorAccounts.${addRole.accountId}`]: true,
      }),
      ...(addRole?.role === AccountRole.trader && {
        [`roles.traderAccounts.${addRole.accountId}`]: true,
      }),
      ...(addRole?.role === AccountRole.viewer && {
        [`roles.viewerAccounts.${addRole.accountId}`]: true,
      }),
      updatedAt: new Date(),
    },
    $unset: {
      ...(removeRole?.role === AccountRole.admin && {
        [`roles.adminAccounts.${removeRole.accountId}`]: '',
      }),
      ...(removeRole?.role === AccountRole.protector && {
        [`roles.protectorAccounts.${removeRole.accountId}`]: '',
      }),
      ...(removeRole?.role === AccountRole.trader && {
        [`roles.traderAccounts.${removeRole.accountId}`]: '',
      }),
      ...(removeRole?.role === AccountRole.viewer && {
        [`roles.viewerAccounts.${removeRole.accountId}`]: '',
      }),
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

const updateUsers: UserRepository['updateUsers'] = async (filter, payload, options) => {
  const userFilter = buildUserFilter(filter);

  const {
    removeRoleAccountId,
  } = payload;

  const updateFilter: UpdateFilter<User> = {
    $set: {
      updatedAt: new Date(),
    },
    $unset: {
      ...(removeRoleAccountId && {
        [`roles.adminAccounts.${removeRoleAccountId}`]: '',
        [`roles.protectorAccounts.${removeRoleAccountId}`]: '',
        [`roles.traderAccounts.${removeRoleAccountId}`]: '',
        [`roles.viewerAccounts.${removeRoleAccountId}`]: '',
      }),
    },
  };

  const { db } = await getMongo();
  const collection = db.collection<User>('users');

  await collection.updateMany(userFilter, updateFilter);

  const {
    returnAfter, projection,
  } = options || {};

  if (returnAfter) {
    const users = await collection.find(userFilter, { projection }).toArray();
    return { docs: users };
  }

  return {};
};

export const MongoUserRepository: UserRepository = {
  getUser,
  getUsers,
  updateUser,
  updateUsers,
};
