import { Account, BaseError } from '@fishprovider/core';
import {
  AccountRepository, GetAccountFilter, RepositoryError,
} from '@fishprovider/repositories';

import {
  connectAndRun, CTraderConfig, getAccountInformation,
} from '..';

const transform = (res: Awaited<ReturnType<typeof getAccountInformation>>): Partial<Account> => ({
  providerPlatformAccountId: res.traderLogin || res.accountId,
  leverage: res.leverage || 0,
  balance: res.balance,
  assetId: res.assetId,
  providerData: res,
  updatedAt: new Date(),
});

const getAccount = async (
  filter: GetAccountFilter,
) => {
  const { config: rawConfig, accountId } = filter;
  if (!rawConfig) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  const { host, port } = rawConfig;
  if (!host || !port) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing host/port');
  }

  const config: CTraderConfig = {
    ...rawConfig,
    host,
    port,
  };

  const account = await connectAndRun({
    config,
    handler: (connection) => getAccountInformation(connection, accountId),
  });

  return { doc: transform(account) };
};

export const CTraderAccountRepository: AccountRepository = {
  getAccount,
};
