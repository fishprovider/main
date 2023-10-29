import { User } from '@fishprovider/core';
import { getUserService } from '@fishprovider/core-backend';
import { DataAccessUserRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  z.object({
  }).strict()
    .parse(data);

  const { doc } = await getUserService({
    filter: {},
    repositories: {
      user: DataAccessUserRepository,
    },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
