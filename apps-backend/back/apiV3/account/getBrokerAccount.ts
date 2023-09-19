import { getBrokerAccountService } from '@fishprovider/base-services';
import { Account } from '@fishprovider/core';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>> = async (data, userSession) => {
  const filter = z.object({
    accountId: z.string(),
  }).strict()
    .parse(data);

  const { doc } = await getBrokerAccountService({
    filter,
    options: {},
    repositories: {
      account: MongoAccountRepository, // TODO: use cacheFirst repo
      broker: MongoAccountRepository, // TODO: use broker repo
    },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
