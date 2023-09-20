import {
  Account, AccountConfig, AccountMember, AccountViewType,
} from '@fishprovider/core';
import {
  AccountRepository, BaseGetOptions, BaseUpdateOptions,
} from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildAccountFilter = (filter: {
  accountId?: string,
  accountIds?: string[],
  accountViewType?: AccountViewType,
  memberId?: string,
  email?: string,
  config?: AccountConfig,
}): Filter<Account> => {
  const {
    accountId, accountViewType, memberId, email,
  } = filter;

  const orFiler: Filter<Account>['$or'] = [
    ...(memberId ? [
      { userId: memberId }, // owner
      { 'members.userId': memberId }, // member
    ] : []),
    ...(email ? [
      { 'memberInvites.email': email }, // memberInvite
    ] : []),
  ];

  return {
    ...(accountId && { _id: accountId }),
    ...(accountViewType && { providerViewType: accountViewType }),
    ...(orFiler.length && { $or: orFiler }),
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

const updateAccount = async (
  filter: {
    accountId: string,
  },
  payload: {
    name?: string,
    addMember?: AccountMember,
    removeMemberId?: string,
    removeMemberInviteEmail?: string,
    providerPlatformAccountId?: string,
    leverage?: number,
    balance?: number,
    assetId?: string,
    providerData?: any,
    updatedAt?: Date,
  },
  options?: BaseUpdateOptions<Account>,
) => {
  const accountFilter = buildAccountFilter(filter);

  const {
    name, addMember, removeMemberId, removeMemberInviteEmail,
    providerPlatformAccountId, leverage, balance, assetId, providerData,
    updatedAt,
  } = payload;
  const {
    returnAfter, projection,
  } = options || {};

  const updateFilter: UpdateFilter<Account> = {
    $set: {
      ...(name && { name }),
      ...(providerPlatformAccountId && { providerPlatformAccountId }),
      ...(leverage && { leverage }),
      ...(balance && { balance }),
      ...(assetId && { assetId }),
      ...(providerData && { providerData }),
      ...(updatedAt && { updatedAt }),
    },
    $push: {
      ...(addMember && { members: addMember }),
    },
    $pull: {
      ...(removeMemberId && {
        members: { userId: removeMemberId },
      }),
      ...(removeMemberInviteEmail && {
        memberInvites: { email: removeMemberInviteEmail },
      }),
    },
  };

  const { db } = await getMongo();
  const collection = db.collection<Account>('accounts');

  if (returnAfter) {
    const { value: account } = await collection.findOneAndUpdate(
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

const getAccounts = async (
  filter: {
    accountIds?: string[],
    accountViewType?: AccountViewType,
    memberId?: string,
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

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
  getAccounts,
};
