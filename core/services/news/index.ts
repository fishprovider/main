import type { NewsRepository } from '@fishprovider/models';

import { getNews } from './getNews';
import { watchNews } from './watchNews';

export interface NewsServiceParams {
  newsRepository: NewsRepository,
}

export class NewsService {
  newsRepository: NewsRepository;

  constructor(params: NewsServiceParams) {
    this.newsRepository = params.newsRepository;
  }

  getNews = getNews(this);
  watchNews = watchNews(this);
}
