import { getAccountsService } from '@fishprovider/base-services';
import { Account, AccountViewType } from '@fishprovider/core';
import { MongoAccountRepository } from '@fishprovider/database';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (_data, userSession) => {
  const { docs } = await getAccountsService({
    filter: {
      accountViewType: AccountViewType.public,
    },
    options: {},
    repositories: { account: MongoAccountRepository },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
