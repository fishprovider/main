import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account } from '@fishprovider/core';
import { getTradeAccountService } from '@fishprovider/core-backend';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { sanitizeOutputAccount } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const getTradeAccount: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      accountId: z.string(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { doc: tradeAccount } = await getTradeAccountService({
    filter,
    repositories: {
      account: CacheFirstAccountRepository,
      trade: TradeAccountRepository,
    },
    context: { userSession },
  });

  return { result: sanitizeOutputAccount(tradeAccount) };
};

export default getTradeAccount;
