import { UserSession } from '@fishprovider/core-backend';

export type ApiHandler<T> = (
  data: any,
  userSession: UserSession,
) => Promise<{
  result?: T,
  userSessionNew?: UserSession,
}>;
