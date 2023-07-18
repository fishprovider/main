import type { News } from '@fishprovider/enterprise-rules';

export interface GetNewsRepositoryParams {
  impact?: string;
}

export interface NewsRepository {
  getNews: (params: GetNewsRepositoryParams) => Promise<News[]>;
}
