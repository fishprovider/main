import type { GetNewsUseCase, WatchNewsUseCase } from '@fishprovider/application-rules';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
) => getNewsUseCase;

export const watchNewsController = (
  watchNewsUseCase: WatchNewsUseCase,
) => watchNewsUseCase;
