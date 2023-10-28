import { UserRepository } from '@fishprovider/core';
import { MongoUserRepository } from '@fishprovider/mongo';

export const DataAccessUserRepository: UserRepository = MongoUserRepository;
