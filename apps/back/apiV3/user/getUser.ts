import { getUserService, User } from '@fishprovider/core-new';
import { MongoUserRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User> | null | undefined> = async (data, userSession) => {
  const { filter, options } = z.object({
    filter: z.object({
      userId: z.string().optional(),
      email: z.string().optional(),
    }).strict(),
    options: z.object({
      projection: z.record(z.string(), z.number()).optional(),
      returnAfter: z.boolean().optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { doc } = await getUserService({
    filter,
    options,
    repositories: { user: MongoUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
