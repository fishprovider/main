import { getAccountService } from '@fishprovider/base-services';
import { Account } from '@fishprovider/core';
import { DataAccessAccountRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { doc } = await getAccountService({
    filter,
    options: {},
    repositories: { account: DataAccessAccountRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
