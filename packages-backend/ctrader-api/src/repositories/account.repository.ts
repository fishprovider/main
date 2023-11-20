import {
  AccountConfig, AccountTradeType, BaseError, RepositoryError,
} from '@fishprovider/core';
import {
  AccountRepository,
} from '@fishprovider/core-backend';

import {
  connectAndRun, getAccountInformation, getAccountList,
} from '..';

const checkConfig = (config?: AccountConfig) => {
  if (!config) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing config');
  }

  const { host, port } = config;
  if (!host || !port) {
    throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, 'Missing host/port');
  }

  return {
    ...config,
    host,
    port,
  };
};

const getAccount: AccountRepository['getAccount'] = async (filter) => {
  const { accountId, config: rawConfig } = filter;
  const config = checkConfig(rawConfig);

  const tradeAccount = await connectAndRun({
    config,
    handler: (connection) => getAccountInformation(connection, config.accountId),
  });

  return {
    doc: {
      _id: accountId,
      assetId: tradeAccount.assetId,
      leverage: tradeAccount.leverage,
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
