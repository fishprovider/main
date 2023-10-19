import { FishApiAccountRepository } from '@fishprovider/fish-api';
import { AccountRepository } from '@fishprovider/repositories';

export const DataFetchAccountRepository: AccountRepository = {
  ...FishApiAccountRepository,
};
