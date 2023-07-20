import type { News } from '@fishprovider/enterprise-rules';

export interface GetNewsRepositoryParams<T = any> {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
  selector?: (input: Record<string, News>) => T,
}

export interface SetNewsRepositoryParams {
  news: News[],
}

export interface NewsRepository {
  getNews: <T>(params: GetNewsRepositoryParams<T>) => Promise<News[] | T | undefined>;
  // TODO: implement all
  setNews?: (params: SetNewsRepositoryParams) => Promise<boolean>;
}
