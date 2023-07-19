import { getNewsUseCase, NewsRepository } from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { UserSession } from '~types';

async function getNews(
  newsRepository: NewsRepository,
  userSession: UserSession,
  data: any,
) {
  requireLogIn(userSession);

  const payload = z.object({
    today: z.boolean().optional(),
    week: z.string().optional(),
    upcoming: z.boolean().optional(),
  }).refine((item) => item.today || item.week || item.upcoming)
    .parse(data);

  const news = await getNewsUseCase({ newsRepository, payload });
  return news;
}

export const NewsController = (
  newsRepository: NewsRepository,
  userSession: UserSession,
) => ({
  getNews: (data: any) => getNews(newsRepository, userSession, data),
});
