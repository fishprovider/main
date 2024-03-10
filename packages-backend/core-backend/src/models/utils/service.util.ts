import { UserRoles } from '@fishprovider/core';

import { RepositoryGetOptions, RepositoryUpdateOptions } from '..';

export interface UserSession {
  _id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRoles;
  starAccounts?: Record<string, boolean>;
}

export interface ServiceContext {
  userSession?: UserSession;
}

export interface BaseGetServiceParams<T> {
  context?: ServiceContext;
  options?: RepositoryGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> {
  context?: ServiceContext;
  options?: RepositoryUpdateOptions<T>,
}
