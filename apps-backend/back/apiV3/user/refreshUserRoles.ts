import { User } from '@fishprovider/core';
import { refreshUserRolesService } from '@fishprovider/core-backend';
import { DataAccessAccountRepository, DataAccessUserRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc } = await refreshUserRolesService({
    filter: {},
    repositories: {
      account: DataAccessAccountRepository,
      user: DataAccessUserRepository,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
