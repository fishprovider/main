import {
  Account, AccountConfig, AccountViewType,
} from '@fishprovider/core';
import {
  AccountRepository,
} from '@fishprovider/core-backend';
import { Filter, ReturnDocument, UpdateFilter } from 'mongodb';

import { getMongo } from '..';

const buildAccountFilter = (filter: {
  accountId?: string,
  accountIds?: string[],
  accountViewType?: AccountViewType,
  email?: string,
  checkExist?: {
    accountId: string,
    name: string,
    tradeAccountId?: string,
  },
}): Filter<Account> => {
  const {
    accountId, accountViewType, email, accountIds, checkExist,
  } = filter;

  const andFilter: Filter<Account>['$and'] = [];

  if (checkExist) {
    const { accountId: checkAccountId, name, tradeAccountId } = checkExist;
    andFilter.push({
      $or: [
        { _id: checkAccountId },
        { name },
        ...(tradeAccountId ? [{ 'config.accountId': tradeAccountId }] : []),
      ],
    });
  }

  return {
    ...(accountId && { _id: accountId }),
    ...(accountIds && { _id: { $in: accountIds } }),
    ...(accountViewType && { accountViewType }),
    ...(email && { 'members.email': email }),
    ...(andFilter.length && { $and: andFilter }),
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
    accountViewType, name, icon, strategyId, assetId, asset,
    leverage, balance, equity, margin, freeMargin, marginLevel,
    notes, privateNotes,
    tradeSettings, protectSettings, settings, bannerStatus,
    providerData,
    addActivity,
  } = payload;
  const {
    returnAfter, projection,
  } = options || {};

  const updatedAccount: Partial<Account> = {
    ...(accountViewType && { accountViewType }),
    ...(name && { name }),
    ...(icon && { icon }),
    ...(strategyId && { strategyId }),
    ...(assetId && { assetId }),
    ...(asset && { asset }),
    ...(leverage && { leverage }),
    ...(balance && { balance }),
    ...(equity && { equity }),
    ...(margin && { margin }),
    ...(freeMargin && { freeMargin }),
    ...(marginLevel && { marginLevel }),
    ...(notes && { notes }),
    ...(privateNotes && { privateNotes }),
    ...(tradeSettings && { tradeSettings }),
    ...(protectSettings && { protectSettings }),
    ...(settings && { settings }),
    ...(bannerStatus && { bannerStatus }),
    ...(providerData && { providerData }),
    updatedAt: new Date(),
  };

  const updateFilter: UpdateFilter<Account> = {
    $set: {
      ...updatedAccount,
      ...(addActivity && {
        [`activities.${addActivity.userId}`]: addActivity,
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
  return {
    doc: { _id: filter.accountId, ...updatedAccount },
  };
};

const addAccount: AccountRepository['addAccount'] = async (payload) => {
  const { accountId, ...rest } = payload;
  const accountNew: Account = {
    ...rest,
    _id: accountId,
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const { db } = await getMongo();
  await db.collection<Account>('accounts').insertOne(accountNew);

  return { doc: accountNew };
};

const removeAccount: AccountRepository['removeAccount'] = async (filter) => {
  const { db } = await getMongo();
  await db.collection<Account>('accounts').updateOne(
    buildAccountFilter(filter),
    {
      $set: {
        deleted: true,
        deletedAt: new Date(),
      },
    },
  );
  return {
    doc: {
      _id: filter.accountId,
      deleted: true,
      deletedAt: new Date(),
    },
  };
};

const getTradeClient: AccountRepository['getTradeClient'] = async (filter) => {
  const { accountPlatform, clientId } = filter;

  const { db } = await getMongo();
  const client = await db.collection<AccountConfig>('clientSecrets').findOne({
    accountPlatform,
    ...(clientId && { clientId }),
  }, {
    projection: {
      clientId: 1,
      clientSecret: 1,
      isLive: 1,
    },
  });

  return { doc: client ?? undefined };
};

const updateTradeClient: AccountRepository['updateTradeClient'] = async (filter) => {
  const { accountPlatform, clientId, addActiveAccounts } = filter;

  const { db } = await getMongo();
  const client = await db.collection<AccountConfig>('clientSecrets').updateOne({
    accountPlatform,
    clientId,
  }, {
    $inc: {
      activeAccounts: addActiveAccounts,
    },
  });

  return { doc: client ?? undefined };
};

export const MongoAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
  updateAccount,
  addAccount,
  removeAccount,
  getTradeClient,
  updateTradeClient,
};
