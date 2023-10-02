import { getUserService } from '@fishprovider/base-services';
import { User } from '@fishprovider/core';
import { DataAccessUserRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const filter = z.object({
    email: z.string().optional(),
  }).strict()
    .parse(data);

  const { doc } = await getUserService({
    filter,
    repositories: { user: DataAccessUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
