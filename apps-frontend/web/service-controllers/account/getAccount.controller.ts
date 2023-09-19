import { getAccountService } from '@fishprovider/base-services';
import { FishApiAccountRepository } from '@fishprovider/data-fetch';

export const getAccountController = (filter: {
  accountId: string,
}) => getAccountService({
  filter,
  options: {},
  repositories: {
    account: FishApiAccountRepository,
  },
});
