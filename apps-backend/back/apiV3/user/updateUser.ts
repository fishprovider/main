import { User } from '@fishprovider/core';
import { updateUserService } from '@fishprovider/core-backend';
import { MongoUserRepository } from '@fishprovider/mongo';
import { z } from 'zod';

import { sanitizeOutputUser } from '~helpers';
import { ApiHandler } from '~types/ApiHandler.model';

const updateUser: ApiHandler<Partial<User>> = async (data, userSession) => {
  const input = z.object({
    payload: z.object({
      name: z.string().optional(),
      starAccount: z.object({
        accountId: z.string(),
        enabled: z.boolean(),
      }).strict().optional(),
    }),
  }).strict()
    .parse(data);

  const { payload } = input;

  const { doc: user } = await updateUserService({
    filter: {
      email: userSession?.email,
    },
    payload,
    repositories: {
      user: MongoUserRepository,
    },
    context: { userSession },
  });

  return { result: sanitizeOutputUser(user) };
};

export default updateUser;
