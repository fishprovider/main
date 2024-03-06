import { AccountError, BaseError, checkRepository } from '@fishprovider/core';

import {
  GetTradeAccountsService,
} from '../..';

export const getTradeAccountsService: GetTradeAccountsService = async ({
  filter, repositories,
}) => {
  //
  // pre-check
  //
  const getTradeClientRepo = checkRepository(repositories.account.getTradeClient);
  const getAccountProvidersRepo = checkRepository(repositories.trade.getAccountProviders);

  //
  // main
  //
  const {
    platform, baseConfig, tradeRequest,
  } = filter;

  const { doc: client } = await getTradeClientRepo({
    platform,
    clientId: baseConfig.clientId,
  });
  if (!client) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Failed to get trade client');
  }
  const { clientId, clientSecret, isLive } = client;
  if (!clientId || !clientSecret) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Missing clientId or clientSecret');
  }

  const { docs: accounts } = await getAccountProvidersRepo({
    platform,
    config: {
      ...baseConfig,
      clientId,
      clientSecret,
      isLive,
    },
    providerCode: tradeRequest?.code,
    providerRedirectUrl: tradeRequest?.redirectUrl,
  });

  return {
    docs: accounts?.map((account) => ({
      ...account,
      ...(account.config && {
        config: {
          ...account.config,
          clientSecret: '',
        },
      }),
    })),
  };
};
