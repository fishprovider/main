import { Account } from '@fishprovider/core';
import {
  AccountRepository, BaseGetOptions, BaseUpdateOptions, GetAccountFilter,
  UpdateAccountPayload,
} from '@fishprovider/repositories';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildAccountFilter = (filter: GetAccountFilter): Filter<Account> => {
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
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
) => {
  const { db } = await getMongo();
  const account = await db.collection<Account>('accounts').findOne(
    buildAccountFilter(filter),
    options,
  );
  return { doc: account ?? undefined };
};

const getAccounts = async (
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
) => {
  const { db } = await getMongo();
  const accounts = await db.collection<Account>('accounts').find(
    buildAccountFilter(filter),
    options,
  ).toArray();
  return { docs: accounts };
};

const updateAccount = async (
  filter: GetAccountFilter,
  payload: UpdateAccountPayload,
  options: BaseUpdateOptions<Account>,
) => {
  const accountFilter = buildAccountFilter(filter);

  const {
    name, addMember, removeMemberId, removeMemberInviteEmail,
  } = payload;
  const {
    returnAfter, projection,
  } = options;

  const updateFilter: UpdateFilter<Account> = {
    $set: {
      ...(name && { name }),
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

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
};
