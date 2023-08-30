import type {
  Account, AccountRepository, BaseGetOptions, BaseUpdateOptions, GetAccountFilter,
  UpdateAccountPayload,
} from '@fishprovider/core-new';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { mongo } from '../main';

const getAccount = async (
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
) => {
  const { accountId, memberId } = filter;
  const { projection } = options;
  const { db } = await mongo.get();
  const account = await db.collection<Account>('accounts').findOne({
    ...(accountId && { _id: accountId }),
    ...(memberId && { 'members.userId': memberId }),
  }, {
    projection,
  });
  return { doc: account };
};

const getAccounts = async (
  filter: GetAccountFilter,
  options: BaseGetOptions<Account>,
) => {
  const { accountIds, memberId } = filter;
  const { projection } = options;
  const { db } = await mongo.get();
  const accounts = await db.collection<Account>('accounts').find({
    ...(accountIds && { _id: { $in: accountIds } }),
    ...(memberId && { 'members.userId': memberId }),
  }, {
    projection,
  }).toArray();
  return { docs: accounts };
};

const updateAccount = async (
  filterRaw: GetAccountFilter,
  payload: UpdateAccountPayload,
  options: BaseUpdateOptions<Account>,
) => {
  const {
    accountId,
  } = filterRaw;
  const {
    name, addMember, removeMemberId, removeMemberInviteEmail,
  } = payload;
  const {
    returnAfter, projection,
  } = options;

  const filter: Filter<Account> = {
    accountId,
  };

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

  const { db } = await mongo.get();
  const collection = db.collection<Account>('accounts');

  if (returnAfter) {
    const { value: account } = await collection.findOneAndUpdate(filter, updateFilter, {
      returnDocument: ReturnDocument.AFTER,
      projection,
    });
    return { doc: account };
  }
  await collection.updateOne(filter, updateFilter);
  return {};
};

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
};
