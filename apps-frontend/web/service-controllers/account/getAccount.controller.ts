import { getAccountService } from '@fishprovider/base-services';
import { FishApiAccountRepository } from '@fishprovider/data-fetching';

export const getAccountController = (filter: {
  accountId: string,
}) => getAccountService({
  filter,
  options: {},
  repositories: {
    account: FishApiAccountRepository,
  },
});
