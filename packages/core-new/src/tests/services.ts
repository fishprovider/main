import {
  AccountService, ContainerService, ServiceName, UserService,
} from '..';
import { accountRepoDefault, userRepoDefault } from '.';

export const containerServiceDefault = new ContainerService();
containerServiceDefault.register(ServiceName.user, UserService, userRepoDefault);
containerServiceDefault.register(ServiceName.account, AccountService, accountRepoDefault);
