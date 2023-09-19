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
}

export interface BaseServiceParams {
  context?: ServiceContext;
}

export interface BaseGetServiceParams<T> extends BaseServiceParams {
  options?: BaseGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> extends BaseServiceParams {
  options?: BaseUpdateOptions<T>,
}
