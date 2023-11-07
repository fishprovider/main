import { User } from '@fishprovider/core';
import { updateUserService } from '@fishprovider/core-backend';
import { MongoUserRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const payload = z.object({
    name: z.string().optional(),
    starAccount: z.object({
      accountId: z.string(),
      enabled: z.boolean(),
    }).optional(),
  }).strict()
    .parse(data);

  const { doc } = await updateUserService({
    filter: {
      email: userSession?.email,
    },
    payload,
    repositories: {
      user: MongoUserRepository,
    },
    context: { userSession },
  });

  return { result: doc };
};

export default handler;
