import {
  AccountService, ContainerService, ServiceName, UserService,
} from '@fishprovider/core-new';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/repository-mongo';

const container = new ContainerService();
container.register(ServiceName.user, UserService, MongoUserRepository);
container.register(ServiceName.account, AccountService, MongoAccountRepository);

export const getContainer = () => container;
export const getUserService = () => container.getService(ServiceName.user);
export const getAccountService = () => container.getService(ServiceName.account);
