import { AccountConfig, BaseError } from '@fishprovider/core';
import {
  AccountRepository, RepositoryError,
} from '@fishprovider/repositories';

import {
  connectAndRun, CTraderConfig, getAccountInformation,
} from '..';

const getAccount = async (
  filter: {
    accountId: string,
    config?: AccountConfig,
  },
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

  return {
    doc: {
      providerPlatformAccountId: account.traderLogin || account.accountId,
      leverage: account.leverage || 0,
      balance: account.balance,
      assetId: account.assetId,
      providerData: account,
      updatedAt: new Date(),
    },
  };
};

export const CTraderAccountRepository: AccountRepository = {
  getAccount,
};
