import { getAccountsService } from '@fishprovider/base-services';
import { Account, AccountViewType } from '@fishprovider/core';
import { MongoAccountRepository } from '@fishprovider/database';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (_data, userSession) => {
  const { docs } = await getAccountsService({
    filter: {
      accountViewType: AccountViewType.public,
    },
    options: {
      projection: {
        config: 0,
        providerData: 0,
      },
    },
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
