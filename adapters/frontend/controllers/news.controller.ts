import type {
  GetNewsUseCase, GetNewsUseCaseParams, WatchNewsUseCase, WatchNewsUseCaseParams,
} from '@fishprovider/application-rules';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
) => async (
  params: GetNewsUseCaseParams,
) => getNewsUseCase(params);

export const watchNewsController = (
  watchNewsUseCase: WatchNewsUseCase,
) => <T>(
  params: WatchNewsUseCaseParams<T>,
) => watchNewsUseCase(params);
