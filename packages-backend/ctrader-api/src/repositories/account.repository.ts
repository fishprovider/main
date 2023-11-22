import {
  AccountConfig, AccountTradeType, BaseError, log,
  RepositoryError,
} from '@fishprovider/core';
import {
  AccountRepository,
} from '@fishprovider/core-backend';
import axios from 'axios';

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
  const { config: rawConfig, tradeRequest } = filter;

  if (rawConfig && tradeRequest) {
    const { clientId, clientSecret, isLive } = rawConfig;
    const { redirectUrl, code } = tradeRequest;
    const url = `https://openapi.ctrader.com/apps/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}&client_id=${clientId}&client_secret=${clientSecret}`;
    log.info('Start getAccounts', url);
    const { data } = await axios.get(url);
    log.info('Done getAccounts', data);
    const { errorCode, accessToken, refreshToken } = data;
    if (errorCode) {
      throw new BaseError(RepositoryError.REPOSITORY_BAD_REQUEST, errorCode);
    } else if (accessToken && refreshToken) {
      rawConfig.accessToken = accessToken;
      rawConfig.refreshToken = refreshToken;
      rawConfig.host = `${isLive ? 'live' : 'demo'}.ctraderapi.com`;
      rawConfig.port = 5035;
    }
  }

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
        accountNumber: tradeAccount.traderLogin,
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
