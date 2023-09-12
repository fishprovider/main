import { updateUserService } from '@fishprovider/base-services';
import { User } from '@fishprovider/core';
import { MongoUserRepository } from '@fishprovider/database';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const { filter, payload } = z.object({
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
  }).strict()
    .parse(data);

  const { doc } = await updateUserService({
    filter,
    payload,
    options: {},
    repositories: { user: MongoUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
