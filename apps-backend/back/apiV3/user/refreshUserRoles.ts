import { CacheFirstUserRepository } from '@fishprovider/cache-first';
import { User } from '@fishprovider/core';
import { refreshUserRolesService } from '@fishprovider/core-backend';
import { MongoAccountRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { sanitizeOutputUser } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const refreshUserRoles: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc: user } = await refreshUserRolesService({
    filter: {
      email: userSession?.email,
    },
    repositories: {
      account: MongoAccountRepository,
      user: CacheFirstUserRepository,
    },
    context: { userSession },
  });

  return {
    result: sanitizeOutputUser(user),
    userSessionNew: {
      ...userSession,
      roles: user?.roles,
    },
  };
};

export default refreshUserRoles;
