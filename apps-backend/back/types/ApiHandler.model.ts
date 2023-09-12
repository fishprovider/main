import { UserSession } from '@fishprovider/base-services';

export type ApiHandler<T> = (
  data: any,
  userSession: UserSession,
) => Promise<{
  result?: T,
  userSessionNew?: UserSession,
}>;
