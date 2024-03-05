import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account, AccountViewType } from '@fishprovider/core';
import { getAccountsService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { sanitizeOutputAccount } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const getAccounts: ApiHandler<Partial<Account>[]> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      viewType: z.nativeEnum(AccountViewType).optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { docs: accounts } = await getAccountsService({
    filter: {
      ...filter,
      ...(filter.viewType === AccountViewType.private && {
        email: userSession.email,
      }),
    },
    options: {
      sort: {
        order: -1,
      },
      expireSec: 60 * 60 * 24 * 7, // 1 week
      reloadSec: 60 * 1, // 1 minute
    },
    repositories: {
      account: CacheFirstAccountRepository,
    },
    context: { userSession },
  });
  return { result: accounts?.map(sanitizeOutputAccount) };
};

export default getAccounts;
