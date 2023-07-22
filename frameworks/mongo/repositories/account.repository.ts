import {
  type AccountRepository,
  DefaultAccountRepository,
  type GetAccountRepositoryParams, type UpdateAccountRepositoryParams,
} from '@fishprovider/application-rules';
import type { Account } from '@fishprovider/enterprise-rules';
import assert from 'assert';

import { mongo } from '../mongo.framework';

const getAccount = async (params: GetAccountRepositoryParams) => {
  const { accountId, query, projection } = params;
  const { db } = await mongo.get();
  const account = await db.collection<Account>('accounts').findOne({
    ...(accountId && { _id: accountId }),
    ...query,
  }, {
    projection,
  });
  return account;
};

const updateAccount = async (params: UpdateAccountRepositoryParams) => {
  const {
    accountId, payload, payloadDelete, payloadPush, payloadPull,
  } = params;
  assert(payload || payloadDelete || payloadPush || payloadPull);

  const { db } = await mongo.get();
  await db.collection<Account>('news').updateOne({
    _id: accountId,
  }, {
    ...(payload && {
      $set: payload,
    }),
    ...(payloadDelete && {
      $unset: payloadDelete,
    }),
    ...(payloadPush && {
      $push: payloadPush,
    }),
    ...(payloadPull && {
      $pull: payloadPull,
    }),
  });
  return true;
};

export const MongoAccountRepository: AccountRepository = {
  ...DefaultAccountRepository,
  getAccount,
  updateAccount,
};
