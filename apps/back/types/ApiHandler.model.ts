import { UserSession } from '@fishprovider/core-new';

export type ApiHandler<T> = (
  data: any,
  userSession: UserSession,
) => Promise<{
  result?: T,
  userSessionNew?: UserSession,
}>;
