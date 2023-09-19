import { MongoUserRepository } from '@fishprovider/mongo';
import {
  UserRepository,
} from '@fishprovider/repositories';

export const DataAccessUserRepository: UserRepository = MongoUserRepository;
