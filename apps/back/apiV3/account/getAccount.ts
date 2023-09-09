import { Account } from '@fishprovider/core';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { getAccountService } from '@fishprovider/services';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
    memberId: z.string().optional(),
  }).strict()
    .parse(data);

  const { doc } = await getAccountService({
    filter,
    options: {},
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
