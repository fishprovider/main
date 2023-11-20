import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account, AccountViewType } from '@fishprovider/core';
import { getAccountsService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (data, userSession) => {
  const filter = z.object({
    accountViewType: z.nativeEnum(AccountViewType).optional(),
    email: z.string().optional(),
  }).strict()
    .parse(data);

  const { accountViewType } = filter;

  const { docs } = await getAccountsService({
    filter: {
      ...(accountViewType === AccountViewType.public ? {
        accountViewType,
      } : {
        accountViewType: AccountViewType.private,
        email: userSession.email,
      }),
    },
    options: {
      initializeCache: true,
      sort: {
        order: -1,
      },
    },
    repositories: {
      account: CacheFirstAccountRepository,
    },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
