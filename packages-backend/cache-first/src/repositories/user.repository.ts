import { UserRepository } from '@fishprovider/core-backend';
import { MongoUserRepository } from '@fishprovider/mongo';

export const CacheFirstUserRepository: UserRepository = {
  ...MongoUserRepository,
};
