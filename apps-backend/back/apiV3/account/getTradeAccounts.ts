import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account, AccountPlatform } from '@fishprovider/core';
import { getTradeAccountsService } from '@fishprovider/core-backend';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const getTradeAccounts: ApiHandler<Partial<Account>[]> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      platform: z.nativeEnum(AccountPlatform),
      baseConfig: z.object({
        clientId: z.string(),
      }).strict(),
      tradeRequest: z.object({
        redirectUrl: z.string(),
        code: z.string(),
      }).strict().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { docs } = await getTradeAccountsService({
    filter,
    repositories: {
      account: CacheFirstAccountRepository,
      trade: TradeAccountRepository,
    },
    context: { userSession },
  });
  return { result: docs };
};

export default getTradeAccounts;
