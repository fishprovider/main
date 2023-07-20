import type { GetNewsUseCase } from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { ApiHandlerParams } from '~types';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
) => async (
  { userSession, data }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const payload = z.object({
    today: z.boolean().optional(),
    week: z.string().optional(),
    upcoming: z.boolean().optional(),
  }).refine((item) => item.today || item.week || item.upcoming)
    .parse({
      ...data,
      today: data.today === 'true',
      upcoming: data.upcoming === 'true',
    });

  const news = await getNewsUseCase({ payload });
  return news;
};
