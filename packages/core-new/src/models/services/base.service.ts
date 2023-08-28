import type { IAccountService, IUserService } from '../..';

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
  getService: <N extends ServiceName>(name: N) => ServiceList[N] | undefined;
}
