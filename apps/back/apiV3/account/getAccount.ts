import { Account, getAccountService } from '@fishprovider/core-new';
import { MongoAccountRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account> | null | undefined> = async (data, userSession) => {
  const { filter, options } = z.object({
    filter: z.object({
      accountId: z.string(),
      memberId: z.string().optional(),
    }).strict(),
    options: z.object({
      projection: z.record(z.string(), z.number()).optional(),
      returnAfter: z.boolean().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { doc } = await getAccountService({
    filter,
    options,
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
