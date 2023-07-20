import type { News } from '@fishprovider/enterprise-rules';

import { RepositoryError } from '~types';

export interface GetNewsRepositoryParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface SetNewsRepositoryParams {
  news: News[],
}

export interface WatchNewsRepositoryParams<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (params: GetNewsRepositoryParams) => Promise<News[] | undefined>;
  setNews: (params: SetNewsRepositoryParams) => Promise<boolean>;
  watchNews: <T>(params: WatchNewsRepositoryParams<T>) => T;
}

export const DefaultNewsRepository: NewsRepository = {
  getNews: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
  setNews: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
  watchNews: () => {
    throw new Error(RepositoryError.NOT_IMPLEMENTED);
  },
};
