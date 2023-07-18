import {
  getNewsUseCase, GetNewsUseCaseParams, NewsRepository,
} from '@fishprovider/application-rules';

export const NewsController = (newsRepository: NewsRepository) => ({
  getNews: async (params: GetNewsUseCaseParams) => {
    const news = await getNewsUseCase(newsRepository, params);
    return news;
  },
});
