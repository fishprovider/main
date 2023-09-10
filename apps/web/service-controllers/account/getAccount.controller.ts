import { FishApiAccountRepository } from '@fishprovider/data-fetching';
import { getAccountService } from '@fishprovider/services';

export const getAccountController = (filter: {
  accountId: string,
}) => getAccountService({
  filter,
  options: {},
  repositories: {
    account: FishApiAccountRepository,
  },
});
