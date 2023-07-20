import type { GetNewsUseCase, GetNewsUseCaseParams } from '@fishprovider/application-rules';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
) => async (
  params: GetNewsUseCaseParams,
) => {
  const news = await getNewsUseCase(params);
  return news;
};
