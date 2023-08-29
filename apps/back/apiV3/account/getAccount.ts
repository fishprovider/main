import { Account, getAccountService } from '@fishprovider/core-new';
import { MongoAccountRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const params = z.object({
    accountId: z.string(),
    memberId: z.string().optional(),
  }).strict()
    .parse(data);

  const result = await getAccountService({
    params,
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result };
};

export default handler;
