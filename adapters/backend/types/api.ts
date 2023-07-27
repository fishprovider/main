import type { UserSession } from './user';

export interface ApiHandlerRequest {
  userSession: UserSession;
  data: any;
}

export type ApiHandlerResponse<T> = Promise<{
  result: T,
  userSessionNew?: UserSession,
}>;

export type ApiHandler<T> = (params: ApiHandlerRequest) => ApiHandlerResponse<T>;
