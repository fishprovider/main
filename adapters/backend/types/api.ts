import type { UserSession } from './user';

export interface ApiHandlerParams {
  userSession: UserSession;
  data: any;
}

export type ApiHandler<T> = (params: ApiHandlerParams) => Promise<T>;
