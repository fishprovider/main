import { Account, AccountViewType } from '@fishprovider/core';
import { DataAccessAccountRepository } from '@fishprovider/data-access';
import { getAccountsService } from '@fishprovider/services';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (data, userSession) => {
  const filter = z.object({
    accountViewType: z.nativeEnum(AccountViewType).optional(),
  }).strict()
    .parse(data);

  const { accountViewType } = filter;

  const { docs } = await getAccountsService({
    filter: {
      ...(accountViewType === AccountViewType.public ? {
        accountViewType,
      } : {
        email: userSession.email,
      }),
    },
    options: {
      sort: {
        order: -1,
      },
    },
    repositories: {
      account: DataAccessAccountRepository,
    },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
