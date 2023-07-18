import { getNewsUseCase, GetNewsUseCaseParams, NewsRepository } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';

export const NewsController = (
  newsRepository: NewsRepository,
  userSession: UserSession,
) => ({
  getNews: async (params: GetNewsUseCaseParams) => {
    const news = await getNewsUseCase(newsRepository, userSession, params);
    return news;
  },
});
