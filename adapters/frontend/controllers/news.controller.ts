import type {
  GetNewsUseCase, GetNewsUseCaseParams, WatchNewsUseCase, WatchNewsUseCaseParams,
} from '@fishprovider/application-rules';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
) => async (
  params: GetNewsUseCaseParams,
) => {
  const news = await getNewsUseCase(params);
  return news;
};

export const watchNewsController = (
  watchNewsUseCase: WatchNewsUseCase,
) => <T>(
  params: WatchNewsUseCaseParams<T>,
) => {
  const res = watchNewsUseCase(params);
  return res;
};
