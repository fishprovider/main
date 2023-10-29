import { Account } from '@fishprovider/core';
import { DataAccessAccountRepository } from '@fishprovider/data-access';
import { getAccountService, getTradeAccountService } from '@fishprovider/services';
import { TradeAccountRepository } from '@fishprovider/trade';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
    getTradeInfo: z.boolean().optional(),
  }).strict()
    .parse(data);

  const { accountId, getTradeInfo } = filter;

  if (getTradeInfo) {
    const { doc } = await getTradeAccountService({
      filter: { accountId },
      repositories: {
        account: DataAccessAccountRepository,
        trade: TradeAccountRepository,
      },
      context: { userSession },
    });
    return { result: doc };
  }

  const { doc } = await getAccountService({
    filter: { accountId },
    repositories: {
      account: DataAccessAccountRepository,
    },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
