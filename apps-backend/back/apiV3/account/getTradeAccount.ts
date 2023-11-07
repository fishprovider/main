import { Account } from '@fishprovider/core';
import { getTradeAccountService } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { accountId } = filter;

  const { doc } = await getTradeAccountService({
    filter: { accountId },
    repositories: {
      account: MongoAccountRepository,
      trade: TradeAccountRepository,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
