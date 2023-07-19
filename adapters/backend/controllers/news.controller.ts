import { getNewsUseCase, NewsRepository } from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { ApiHandlerParams } from '~types';

export const getNews = (
  newsRepository: NewsRepository,
) => async (
  { userSession, data }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const payload = z.object({
    today: z.boolean().optional(),
    week: z.string().optional(),
    upcoming: z.boolean().optional(),
  }).refine((item) => item.today || item.week || item.upcoming)
    .parse(data);

  const news = await getNewsUseCase({ newsRepository, payload });
  return news;
};
