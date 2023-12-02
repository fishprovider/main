import { CacheFirstUserRepository } from '@fishprovider/cache-first';
import { User } from '@fishprovider/core';
import { getUserService } from '@fishprovider/core-backend';
import { z } from 'zod';

import { sanitizeOutputUser } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const getUser: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc: user } = await getUserService({
    filter: {
      email: userSession?.email,
    },
    repositories: {
      user: CacheFirstUserRepository,
    },
    context: { userSession },
  });
  return { result: sanitizeOutputUser(user) };
};

export default getUser;
