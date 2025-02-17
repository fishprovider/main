import { CacheFirstAccountRepository, CacheFirstUserRepository } from '@fishprovider/cache-first';
import { User } from '@fishprovider/core';
import { refreshUserRolesService } from '@fishprovider/core-backend';
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
    options: {
      expireSec: 60 * 60 * 24 * 7, // 1 week
      reloadSec: 60 * 60, // 1 hour
    },
    repositories: {
      account: CacheFirstAccountRepository,
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
