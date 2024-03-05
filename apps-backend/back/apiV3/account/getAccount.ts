import { CacheFirstAccountRepository } from '@fishprovider/cache-first';
import { Account } from '@fishprovider/core';
import { getAccountService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { sanitizeOutputAccount } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const getAccount: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      accountId: z.string(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { doc: account } = await getAccountService({
    filter,
    options: {
      ttlSec: 60 * 60 * 24 * 7, // 1 week
    },
    repositories: {
      account: CacheFirstAccountRepository,
    },
    context: { userSession },
  });

  return { result: sanitizeOutputAccount(account) };
};

export default getAccount;
