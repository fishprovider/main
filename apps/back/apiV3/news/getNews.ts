import { getNewsService, News } from '@fishprovider/core-new';
import { MongoNewsRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<News>[] | null> = async (data, userSession) => {
  const filter = z.object({
    today: z.string().optional(),
    week: z.string().optional(),
    upcoming: z.string().optional(),
  }).strict()
    .parse(data);

  const { docs } = await getNewsService({
    filter: {
      ...filter,
      today: filter.today === 'true',
      upcoming: filter.upcoming === 'true',
    },
    options: {},
    repositories: { news: MongoNewsRepository },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
