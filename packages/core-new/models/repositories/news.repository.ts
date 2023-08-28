import type { News } from '..';

export interface GetNewsParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface WatchNewsParams<T> {
  selector: (input: Record<string, News>) => T,
}

export interface NewsRepository {
  getNews: (params: GetNewsParams) => Promise<News[] | null>;
  watchNews: <T>(params: WatchNewsParams<T>) => T;
}

export const newsRepoDefault: NewsRepository = {
  getNews: async () => null,
  watchNews: <any>({ selector: () => [] }),
};
