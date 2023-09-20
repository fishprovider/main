import { FishApiUserRepository } from '@fishprovider/fish-api';
import {
  UserRepository,
} from '@fishprovider/repositories';

export const DataFetchUserRepository: UserRepository = FishApiUserRepository;
