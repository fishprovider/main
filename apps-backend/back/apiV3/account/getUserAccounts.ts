import { getAccountsService } from '@fishprovider/base-services';
import { Account } from '@fishprovider/core';
import { DataAccessAccountRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { docs } = await getAccountsService({
    filter: {
      email: userSession.email,
    },
    options: {
      sort: {
        order: -1,
      },
    },
    repositories: { account: DataAccessAccountRepository },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
