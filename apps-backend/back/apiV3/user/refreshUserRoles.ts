import { CacheFirstAccountRepository, CacheFirstUserRepository } from '@fishprovider/cache-first';
import { User } from '@fishprovider/core';
import { refreshUserRolesService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc } = await refreshUserRolesService({
    filter: {
      email: userSession?.email,
    },
    repositories: {
      account: CacheFirstAccountRepository,
      user: CacheFirstUserRepository,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
