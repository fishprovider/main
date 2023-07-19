import { getNewsUseCase, GetNewsUseCasePayload, NewsRepository } from '@fishprovider/application-rules';
import { UserError, UserSession } from '@fishprovider/enterprise-rules';

import { BackendError } from '~types';

const getNews = (newsRepository: NewsRepository, userSession: UserSession) => async (
  payload: GetNewsUseCasePayload,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }
  const { today, week, upcoming } = payload;
  if (!(today || week || upcoming)) {
    throw new Error(BackendError.BAD_REQUEST);
  }

  const news = await getNewsUseCase({ newsRepository, userSession, payload });
  return news;
};

export const NewsController = (
  newsRepository: NewsRepository,
  userSession: UserSession,
) => ({
  getNews: getNews(newsRepository, userSession),
});
