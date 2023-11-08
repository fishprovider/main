import { CacheFirstNewsRepository } from '@fishprovider/cache-first';
import { News } from '@fishprovider/core';
import { getNewsService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<News>[]> = async (data, userSession) => {
  const filter = z.object({
    today: z.boolean().optional(),
    upcoming: z.boolean().optional(),
    week: z.string().optional(),
  }).strict()
    .parse(data);

  const { today, upcoming, week } = filter;

  const { docs } = await getNewsService({
    filter: {
      today,
      upcoming,
      week,
    },
    repositories: {
      news: CacheFirstNewsRepository,
    },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
