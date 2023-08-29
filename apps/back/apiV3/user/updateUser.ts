import { updateUserService, User } from '@fishprovider/core-new';
import { MongoUserRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const params = z.object({
    starProvider: z.object({
      accountId: z.string(),
      enabled: z.boolean(),
    }).optional(),
  }).strict()
    .parse(data);

  const result = await updateUserService({
    params,
    repositories: { user: MongoUserRepository },
    context: { userSession },
  });
  return { result };
};

export default handler;
