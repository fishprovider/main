import { Account, getAccountService } from '@fishprovider/core-new';
import { MongoAccountRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account> | undefined> = async (data, userSession) => {
  const { filter } = z.object({
    filter: z.object({
      accountId: z.string(),
      memberId: z.string().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { doc } = await getAccountService({
    filter,
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
