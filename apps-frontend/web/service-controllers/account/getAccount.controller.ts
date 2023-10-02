import { getAccountService } from '@fishprovider/base-services';
import { DataFetchAccountRepository } from '@fishprovider/data-fetch';

export const getAccountController = (filter: {
  accountId: string,
}) => getAccountService({
  filter,
  repositories: {
    account: DataFetchAccountRepository,
  },
});
