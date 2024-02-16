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
  viewType?: AccountViewType,
  email?: string,
  checkExist?: {
    accountId: string,
    name: string,
    tradeAccountId?: string,
  },
}): Filter<Account> => {
  const {
    accountId, viewType, email, accountIds, checkExist,
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
    ...(accountIds?.length && { _id: { $in: accountIds } }),
    ...(viewType && { viewType }),
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

const getAccountBase: AccountRepository['getAccountBase'] = async (filter, options) => {
  const { db } = await getMongo();
  const account = await db.collection<Account>('accounts').findOne(
    buildAccountFilter(filter),
    options,
  );
  return { doc: account ?? undefined };
};

const checkAccount: AccountRepository['checkAccount'] = async (filter) => {
  const { db } = await getMongo();
  const { accountId, name, providerAccountId } = filter;
  const count = await db.collection<Account>('accounts').countDocuments(
    {
      $or: [
        { _id: accountId },
        { name },
        ...(providerAccountId ? [{ 'config.accountId': providerAccountId }] : []),
      ],
    },
  );
  return { found: count > 0, count };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter, options) => {
  const { db } = await getMongo();
  const accounts = await db.collection<Account>('accounts').find(
    buildAccountFilter(filter),
    options,
  ).toArray();
  return { docs: accounts };
};

const getManyAccountBase: AccountRepository['getManyAccountBase'] = async (filter, options) => {
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
    viewType, name, icon, strategyId, assetId, asset,
    leverage, balance, equity, margin, freeMargin, marginLevel,
    notes, privateNotes,
    bannerStatus, tradeSettings, protectSettings, settings,
    providerData,
    addActivity, addMember, removeMemberEmail,
  } = payload;
  const {
    returnAfter = true,
    projection,
  } = options || {};

  const updatedAccount: Partial<Account> = {
    ...(viewType && { viewType }),
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
    ...(bannerStatus && { bannerStatus }),
    ...(tradeSettings && { tradeSettings }),
    ...(protectSettings && { protectSettings }),
    ...(settings && { settings }),
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
    $push: {
      ...(addMember && {
        members: addMember,
      }),
    },
    $pull: {
      ...(removeMemberEmail && {
        members: { email: removeMemberEmail },
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
  const { platform, clientId } = filter;

  const { db } = await getMongo();
  const client = await db.collection<AccountConfig>('clientSecrets').findOne({
    platform,
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
  const { platform, clientId, addActiveAccounts } = filter;

  const { db } = await getMongo();
  const client = await db.collection<AccountConfig>('clientSecrets').updateOne({
    platform,
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
  getAccountBase,
  checkAccount,
  getAccounts,
  getManyAccountBase,
  updateAccount,
  addAccount,
  removeAccount,
  getTradeClient,
  updateTradeClient,
};
