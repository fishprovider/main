import { getAccountsService } from '@fishprovider/base-services';
import { Account, AccountViewType } from '@fishprovider/core';
import { DataAccessAccountRepository } from '@fishprovider/data-access';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<Account>[]> = async (_data, userSession) => {
  const { docs } = await getAccountsService({
    filter: {
      accountViewType: AccountViewType.public,
    },
    options: {
      projection: {
        providerData: 0,
      },
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
