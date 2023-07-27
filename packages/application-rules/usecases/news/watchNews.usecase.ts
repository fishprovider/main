import type { NewsRepository, WatchNewsRepositoryParams } from '~repositories';

export type WatchNewsUseCaseParams<T> = WatchNewsRepositoryParams<T>;

export class WatchNewsUseCase {
  newsRepository: NewsRepository;

  constructor(
    newsRepository: NewsRepository,
  ) {
    this.newsRepository = newsRepository;
  }

  run<T>(
    params: WatchNewsUseCaseParams<T>,
  ): T {
    const res = this.newsRepository.watchNews(params);
    return res;
  }
}
