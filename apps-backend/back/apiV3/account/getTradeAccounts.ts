import { Account, AccountPlatform } from '@fishprovider/core';
import { getTradeAccountsService } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { sanitizeOutputAccount } from '~helpers';
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

  const { docs: tradeAccounts } = await getTradeAccountsService({
    filter,
    repositories: {
      account: MongoAccountRepository,
      trade: TradeAccountRepository,
    },
    context: { userSession },
  });
  return { result: tradeAccounts?.map(sanitizeOutputAccount) };
};

export default getTradeAccounts;
