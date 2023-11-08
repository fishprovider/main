import { CacheFirstUserRepository } from '@fishprovider/cache-first';
import { User } from '@fishprovider/core';
import { getUserService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc } = await getUserService({
    filter: {
      email: userSession?.email,
    },
    repositories: {
      user: CacheFirstUserRepository,
    },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
