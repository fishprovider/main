import { CacheFirstNewsRepository } from '@fishprovider/cache-first';
import { News } from '@fishprovider/core';
import { getNewsService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const getNews: ApiHandler<Partial<News>[]> = async (data, userSession) => {
  const input = z.object({
    filter: z.object({
      today: z.boolean().optional(),
      upcoming: z.boolean().optional(),
      week: z.string().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { filter } = input;

  const { docs } = await getNewsService({
    filter,
    repositories: {
      news: CacheFirstNewsRepository,
    },
    context: { userSession },
  });
  return { result: docs };
};

export default getNews;
