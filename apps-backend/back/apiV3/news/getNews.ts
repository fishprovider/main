import { getNewsService } from '@fishprovider/base-services';
import { News } from '@fishprovider/core';
import { DataAccessNewsRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<News>[]> = async (data, userSession) => {
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
    repositories: { news: DataAccessNewsRepository },
    context: { userSession },
  });
  return { result: docs };
};

export default handler;
