import type { GetNewsParams, NewsRepository } from './news.repository';

export const getNewsUseCase = async (
  newsRepository: NewsRepository,
  params: GetNewsParams,
) => {
  const news = await newsRepository.getNews(params);
  return news;
};
