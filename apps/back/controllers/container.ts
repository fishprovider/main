import {
  AccountService, ContainerService, ServiceName, UserService,
} from '@fishprovider/core-new';

const container = new ContainerService();
container.register(ServiceName.user, UserService);
container.register(ServiceName.account, AccountService);

export const getContainer = () => container;
export const getUserService = () => container.getService(ServiceName.user);
export const getAccountService = () => container.getService(ServiceName.account);
