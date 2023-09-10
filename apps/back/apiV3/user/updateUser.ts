import { User } from '@fishprovider/core';
import { MongoUserRepository } from '@fishprovider/database';
import { updateUserService } from '@fishprovider/services';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const { filter, payload, options } = z.object({
    filter: z.object({
      userId: z.string().optional(),
      email: z.string().optional(),
    }).strict(),
    payload: z.object({
      starProvider: z.object({
        accountId: z.string(),
        enabled: z.boolean(),
      }).optional(),
    }).strict(),
    options: z.object({
      projection: z.record(z.string(), z.number()).optional(),
      returnAfter: z.boolean().optional(),
    }),
  }).strict()
    .parse(data);

  const { doc } = await updateUserService({
    filter,
    payload,
    options,
    repositories: { user: MongoUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
