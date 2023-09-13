import { UserRoles } from '@fishprovider/core';

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
