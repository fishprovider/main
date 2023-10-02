import { Account, AccountMember, AccountViewType } from '@fishprovider/core';
import { AccountRepository, BaseGetOptions, BaseUpdateOptions } from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildAccountFilter = (filter: {
  accountId?: string,
  accountIds?: string[],
  accountViewType?: AccountViewType,
  email?: string,
  member?: AccountMember,
}): Filter<Account> => {
  const {
    accountId, accountViewType, email, accountIds, member,
  } = filter;

  return {
    ...(accountId && { _id: accountId }),
    ...(accountIds && { _id: { $in: accountIds } }),
    ...(accountViewType && { providerViewType: accountViewType }),
    ...(email && { 'members.email': email }),
    ...(member?.status === 'update' && { 'members.email': member.email }),
    deleted: { $ne: true },
  };
};

const getAccount = async (
  filter: {
    accountId: string,
  },
  options?: BaseGetOptions<Account>,
) => {
  const { db } = await getMongo();
  const account = await db.collection<Account>('accounts').findOne(
    buildAccountFilter(filter),
    options,
  );
  return { doc: account ?? undefined };
};

const getAccounts = async (
  filter: {
    accountIds?: string[],
    accountViewType?: AccountViewType,
    email?: string,
  },
  options?: BaseGetOptions<Account>,
) => {
  const { db } = await getMongo();
  const accounts = await db.collection<Account>('accounts').find(
    buildAccountFilter(filter),
    options,
  ).toArray();
  return { docs: accounts };
};

const updateAccount = async (
  filter: {
    accountId: string,
  },
  payload: {
    name?: string,
    assetId?: string,
    leverage?: number,
    balance?: number,
    providerData?: any,
    member?: AccountMember,
  },
  options?: BaseUpdateOptions<Account>,
) => {
  const accountFilter = buildAccountFilter(filter);

  const {
    name,
    assetId, leverage, balance, providerData,
    member,
  } = payload;
  const {
    returnAfter, projection,
  } = options || {};

  const updateFilter: UpdateFilter<Account> = {
    $set: {
      ...(name && { name }),
      ...(assetId && { assetId }),
      ...(leverage && { leverage }),
      ...(balance && { balance }),
      ...(providerData && { providerData }),
      ...(member?.status === 'update' && {
        'members.$': {
          ...member,
          status: 'done',
        },
      }),
      updatedAt: new Date(),
    },
    $push: {
      ...(member?.status === 'add' && {
        members: {
          ...member,
          status: 'done',
        },
      }),
    },
    $pull: {
      ...(member?.status === 'remove' && {
        members: {
          email: member.email,
        },
      }),
    },
  };

  const { db } = await getMongo();
  const collection = db.collection<Account>('accounts');

  if (returnAfter) {
    const account = await collection.findOneAndUpdate(
      accountFilter,
      updateFilter,
      {
        returnDocument: ReturnDocument.AFTER,
        projection,
      },
    );
    return { doc: account ?? undefined };
  }
  await collection.updateOne(accountFilter, updateFilter);
  return {};
};

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
};
