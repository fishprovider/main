import { Account, AccountMember, AccountViewType } from '@fishprovider/core';
import { AccountRepository } from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildAccountFilter = (filter: {
  accountId?: string,
  accountIds?: string[],
  accountViewType?: AccountViewType,
  email?: string,
  member?: AccountMember,
  orFilter?: {
    accountId?: string,
    name?: string,
    tradeAccountId?: string,
  },
}): Filter<Account> => {
  const {
    accountId, accountViewType, email, accountIds, member, orFilter,
  } = filter;

  return {
    ...(accountId && { _id: accountId }),
    ...(accountIds && { _id: { $in: accountIds } }),
    ...(accountViewType && { accountViewType }),
    ...(email && { 'members.email': email }),
    ...(member?.status === 'update' && { 'members.email': member.email }),
    ...(orFilter && {
      $or: [
        ...(orFilter.accountId ? [{ _id: orFilter.accountId }] : []),
        ...(orFilter.name ? [{ name: orFilter.name }] : []),
        ...(orFilter.tradeAccountId ? [{ 'config.accountId': orFilter.tradeAccountId }] : []),
      ],
    }),
    deleted: { $ne: true },
  };
};

const getAccount: AccountRepository['getAccount'] = async (filter, options) => {
  const { db } = await getMongo();
  const account = await db.collection<Account>('accounts').findOne(
    buildAccountFilter(filter),
    options,
  );
  return { doc: account ?? undefined };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const { db } = await getMongo();
  const accounts = await db.collection<Account>('accounts').find(
    buildAccountFilter(filter),
    options,
  ).toArray();
  return { docs: accounts };
};

const updateAccount: AccountRepository['updateAccount'] = async (filter, payload, options) => {
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
