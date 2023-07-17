import {
  GetNewsParams, getNewsUseCase, NewsRepository,
} from '@fishprovider/application-rules';

export const NewsController = (newsRepository: NewsRepository) => ({
  getNews: async (params: GetNewsParams) => {
    const news = await getNewsUseCase(newsRepository, params);
    return news;
  },
});
