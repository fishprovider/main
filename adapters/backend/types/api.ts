import type { UserSession } from './user';

export interface ApiHandlerParams {
  userSession: UserSession;
  data: any;
}

export interface ApiHandlerResponse<T> {
  result: T,
  userSessionNew?: UserSession,
}

export type ApiHandler<T> = (params: ApiHandlerParams) => Promise<ApiHandlerResponse<T>>;
