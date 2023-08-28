import type {
  Account, AccountRepository, GetAccountParams, UpdateAccountParams,
} from '@fishprovider/core-new';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { mongo } from '../main';

const getAccount = async (params: GetAccountParams) => {
  const { accountId, memberId, projection } = params;
  const { db } = await mongo.get();
  const account = await db.collection<Account>('accounts').findOne({
    ...(accountId && { _id: accountId }),
    ...(memberId && {
      $or: [
        { userId: memberId },
        { 'members.userId': memberId },
        { 'memberInvites.userId': memberId },
      ],
    }),
  }, {
    projection,
  });
  return account;
};

const updateAccount = async (params: UpdateAccountParams) => {
  const {
    accountId, name, addMember, removeMemberId, removeMemberInviteEmail,
    returnDoc, projection,
  } = params;

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

  if (returnDoc) {
    return collection.findOneAndUpdate(filter, updateFilter, {
      returnDocument: ReturnDocument.AFTER,
      projection,
    });
  }
  await collection.updateOne(filter, updateFilter);
  return {};
};

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
};
