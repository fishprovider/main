import type { NewsRepository, WatchNewsRepositoryParams } from './_news.repository';

export type WatchNewsUseCaseParams<T> = WatchNewsRepositoryParams<T>;

export type WatchNewsUseCase = <T>(params: WatchNewsUseCaseParams<T>) => T;

export const watchNewsUseCase = (
  newsRepository: NewsRepository,
): WatchNewsUseCase => <T>(
  params: WatchNewsUseCaseParams<T>,
) => {
  const res = newsRepository.watchNews(params);
  return res;
};
