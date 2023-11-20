import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account } from '@fishprovider/core';
import { getAccountService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { accountId } = filter;

  const { doc } = await getAccountService({
    filter: { accountId },
    repositories: {
      account: CacheFirstAccountRepository,
    },
    options: {
      initializeCache: true,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
