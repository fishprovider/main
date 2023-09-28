import { UserRoles } from '@fishprovider/core';
import { BaseGetOptions, BaseUpdateOptions } from '@fishprovider/repositories';

export interface UserSession {
  _id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRoles;
  starProviders?: Record<string, boolean>;
}

export interface ServiceContext {
  userSession?: UserSession;
  internal?: boolean;
}

export interface BaseGetServiceParams<T> {
  context?: ServiceContext;
  options?: BaseGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> {
  context?: ServiceContext;
  options?: BaseUpdateOptions<T>,
}
