import { Account } from '@fishprovider/core';
import { removeAccountService } from '@fishprovider/core-backend';
import { DataAccessAccountRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { accountId } = filter;

  await removeAccountService({
    filter: { accountId },
    repositories: {
      account: DataAccessAccountRepository,
    },
    context: { userSession },
  });

  return {};
};

export default handler;
