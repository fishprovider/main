import { getUserService } from '@fishprovider/base-services';
import { User } from '@fishprovider/core';
import { MongoUserRepository } from '@fishprovider/database';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const filter = z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
  }).strict()
    .parse(data);

  const { doc } = await getUserService({
    filter,
    options: {},
    repositories: { user: MongoUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
