import type {
  Account, AccountRepository, GetAccountParams, UpdateAccountParams,
} from '@fishprovider/core-new';

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
  throw new Error('Not implemented', { cause: params });
};

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  updateAccount,
};
