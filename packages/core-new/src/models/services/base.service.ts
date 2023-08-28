import type { IAccountService, IUserService, UserRoles } from '../..';

export enum ServiceName {
  user = 'user',
  account = 'account',
}

export interface ServiceList {
  [ServiceName.user]: IUserService;
  [ServiceName.account]: IAccountService;
}

export type Services = Partial<ServiceList>;

export interface BaseService {
  name: string;
  getService: <N extends ServiceName>(name: N) => ServiceList[N];
}

export interface UserSession {
  _id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRoles;
  starProviders?: Record<string, boolean>;
}
