import type { GetNewsUseCase } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandler } from '~types';

export const getNewsController = (
  getNewsUseCase: GetNewsUseCase,
): ApiHandler<News[]> => async ({ userSession, data }) => {
  requireLogin(userSession);

  const finalData = {
    ...data,
    today: data.today === 'true',
    upcoming: data.upcoming === 'true',
  };

  const payload = z.object({
    today: z.boolean().optional(),
    week: z.string().optional(),
    upcoming: z.boolean().optional(),
  }).strict()
    .refine((item) => item.today || item.week || item.upcoming)
    .parse(finalData);

  const result = await getNewsUseCase(payload);
  return { result };
};
