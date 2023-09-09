import { UserSession } from '@fishprovider-new/core';

export type ApiHandler<T> = (
  data: any,
  userSession: UserSession,
) => Promise<{
  result?: T,
  userSessionNew?: UserSession,
}>;
