import type { NewsEntity } from '@fishprovider/enterprise-rules';

export interface GetNewsParams {
  impact?: string;
}

export interface NewsRepository {
  getNews: (params: GetNewsParams) => Promise<NewsEntity[]>;
}
