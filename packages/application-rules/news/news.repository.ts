import type { News } from '@fishprovider/enterprise-rules';

export interface GetNewsRepositoryParams {
  today?: boolean,
  week?: string,
  upcoming?: boolean,
}

export interface NewsRepository {
  getNews: (params: GetNewsRepositoryParams) => Promise<News[]>;
}
