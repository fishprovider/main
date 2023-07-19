import { getNewsUseCase, GetNewsUseCasePayload, NewsRepository } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';

const getNews = (newsRepository: NewsRepository, userSession: UserSession) => async (
  payload: GetNewsUseCasePayload,
) => {
  const news = await getNewsUseCase({ newsRepository, userSession, payload });
  return news;
};

export const NewsController = (
  newsRepository: NewsRepository,
  userSession: UserSession,
) => ({
  getNews: getNews(newsRepository, userSession),
});
