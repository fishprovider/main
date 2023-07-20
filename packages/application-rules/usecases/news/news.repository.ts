import type { News } from '@fishprovider/enterprise-rules';

export interface SetNewsRepositoryParams {
  news: News[],
}

export interface GetNewsRepositoryParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface UseNewsRepositoryParams<T> {
  query: (input: Record<string, News> | News[]) => T,
}

export interface NewsRepository {
  setNews?: (params: SetNewsRepositoryParams) => Promise<boolean>;
  getNews: (params: GetNewsRepositoryParams) => Promise<News[] | undefined>;
  useNews?: <T>(params: UseNewsRepositoryParams<T>) => T;
}
