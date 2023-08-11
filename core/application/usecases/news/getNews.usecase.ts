import type { News } from '@fishprovider/enterprise';

import type { GetNewsRepositoryParams, NewsRepository } from '~repositories';

export type GetNewsUseCaseParams = GetNewsRepositoryParams;

export class GetNewsUseCase {
  newsRepository: NewsRepository;

  constructor(
    newsRepository: NewsRepository,
  ) {
    this.newsRepository = newsRepository;
  }

  async run(
    params: GetNewsUseCaseParams,
  ): Promise<News[]> {
    const news = await this.newsRepository.getNews(params);
    return news || [];
  }
}
