import type { NewsRepository, WatchNewsRepositoryParams } from './news.repository';

export type WatchNewsUseCasePayload<T> = WatchNewsRepositoryParams<T>;

export interface WatchNewsUseCaseParams<T> {
  payload: WatchNewsUseCasePayload<T>,
}

export type WatchNewsUseCase = <T>(params: WatchNewsUseCaseParams<T>) => T;

export const watchNewsUseCase = (
  newsRepository: NewsRepository,
): WatchNewsUseCase => <T>(
  params: WatchNewsUseCaseParams<T>,
) => {
  const { payload } = params;
  const res = newsRepository.watchNews(payload);
  return res;
};
