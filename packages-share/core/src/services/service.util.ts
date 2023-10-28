import { BaseGetOptions, BaseUpdateOptions, UserRoles } from '..';

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

export interface BaseGetServiceParams<T> {
  context?: ServiceContext;
  options?: BaseGetOptions<T>,
}

export interface BaseUpdateServiceParams<T> {
  context?: ServiceContext;
  options?: BaseUpdateOptions<T>,
}
