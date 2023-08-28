import type { UserRoles } from '@fishprovider/core-new';

export interface UserSession {
  _id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRoles;
  starProviders?: Record<string, boolean>;
}
