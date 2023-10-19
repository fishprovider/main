import { AccountConfig, AccountTradeType, BaseError } from '@fishprovider/core';
import { AccountRepository, RepositoryError } from '@fishprovider/repositories';

import {
  connectAndRun, getAccountInformation, getAccountList,
} from '..';

const checkConfig = (rawConfig?: AccountConfig) => {
  if (!rawConfig) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  const { host, port } = rawConfig;
  if (!host || !port) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing host/port');
  }

  return {
    ...rawConfig,
    host,
    port,
  };
};

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { config: rawConfig, accountId } = filter;

  const config = checkConfig(rawConfig);

  const tradeAccount = await connectAndRun({
    config,
    handler: (connection) => getAccountInformation(connection, accountId),
  });

  return {
    doc: {
      assetId: tradeAccount.assetId,
      leverage: tradeAccount.leverage || 0,
      balance: tradeAccount.balance,
      providerData: tradeAccount,
    },
  };
};

const getAccounts: AccountRepository['getAccounts'] = async (filter) => {
  const { config: rawConfig } = filter;

  const config = checkConfig(rawConfig);

  const { accounts: tradeAccounts } = await connectAndRun({
    config,
    handler: (connection) => getAccountList(connection, config.accessToken),
  });

  const accounts = tradeAccounts
    .map((tradeAccount) => ({
      config: {
        ...config,
        accountId: tradeAccount.accountId,
        traderLogin: tradeAccount.traderLogin,
      },
      providerTradeType: tradeAccount.isLive ? AccountTradeType.live : AccountTradeType.demo,
      accountTradeType: tradeAccount.isLive ? AccountTradeType.live : AccountTradeType.demo,
    }));

  return {
    docs: accounts,
  };
};

export const CTraderAccountRepository: AccountRepository = {
  getAccount,
  getAccounts,
};
