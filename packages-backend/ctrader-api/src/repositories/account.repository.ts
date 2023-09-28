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

  const tradeAccount = await connectAndRun({
    config,
    handler: (connection) => getAccountInformation(connection, accountId),
  });

  return {
    doc: {
      balance: tradeAccount.balance,
      assetId: tradeAccount.assetId,
      leverage: tradeAccount.leverage || 0,
      providerPlatformAccountId: tradeAccount.traderLogin || tradeAccount.accountId,
      providerData: tradeAccount,
      updatedAt: new Date(),
    },
  };
};

export const CTraderAccountRepository: AccountRepository = {
  getAccount,
};
