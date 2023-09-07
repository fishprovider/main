import {
  AccountRoles,
  BaseGetOptions,
  BaseUpdateOptions,
  type GetUserFilter, RepositoryError,
  type UpdateUserPayload, type User, type UserRepository,
} from '@fishprovider/core-new';
import { getMongo } from '@fishprovider/libs';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

const roleFields = {
  [AccountRoles.admin]: 'adminProviders',
  [AccountRoles.protector]: 'protectorProviders',
  [AccountRoles.trader]: 'traderProviders',
  [AccountRoles.viewer]: 'viewerProviders',
};

const getUser = async (
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
) => {
  const { userId, email } = filter;
  const { projection } = options;
  const { db } = await getMongo();
  const user = await db.collection<User>('users').findOne({
    ...(userId && { _id: userId }),
    ...(email && { email }),
  }, {
    projection,
  });
  return { doc: user };
};

const updateUser = async (
  filterRaw: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
) => {
  const { userId, email } = filterRaw;
  const {
    name, picture, starProvider, addRole, roles,
  } = payload;
  const {
    returnAfter, projection,
  } = options;

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

  const { db } = await getMongo();
  const collection = db.collection<User>('users');

  if (returnAfter) {
    const { value: user } = await collection.findOneAndUpdate(filter, updateFilter, {
      returnDocument: ReturnDocument.AFTER,
      projection,
    });
    return { doc: user };
  }
  await collection.updateOne(filter, updateFilter);
  return {};
};

export const MongoUserRepository: UserRepository = {
  getUser,
  updateUser,
};
