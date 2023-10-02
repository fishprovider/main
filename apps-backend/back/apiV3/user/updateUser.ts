import { updateUserService } from '@fishprovider/base-services';
import { User } from '@fishprovider/core';
import { DataAccessUserRepository } from '@fishprovider/data-access';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const { filter, payload } = z.object({
    filter: z.object({
      email: z.string().optional(),
    }).strict(),
    payload: z.object({
      starAccount: z.object({
        accountId: z.string(),
        enabled: z.boolean(),
      }).optional(),
    }).strict(),
  }).strict()
    .parse(data);

  const { doc } = await updateUserService({
    filter,
    payload,
    repositories: { user: DataAccessUserRepository },
    context: { userSession },
  });
  return { result: doc };
};

export default handler;
