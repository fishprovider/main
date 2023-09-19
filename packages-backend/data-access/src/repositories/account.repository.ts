import { MongoAccountRepository } from '@fishprovider/mongo';
import {
  AccountRepository,
} from '@fishprovider/repositories';

export const DataAccessAccountRepository: AccountRepository = MongoAccountRepository;
