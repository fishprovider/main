import type { UserSession } from '@fishprovider/adapter-backend';

export interface ApiHandlerParams {
  userSession: UserSession;
  data: any;
}

export type ApiHandler<T> = (params: ApiHandlerParams) => Promise<T>;
