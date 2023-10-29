import { UserRepository } from '@fishprovider/core-backend';
import { MongoUserRepository } from '@fishprovider/mongo';

export const DataAccessUserRepository: UserRepository = MongoUserRepository;
