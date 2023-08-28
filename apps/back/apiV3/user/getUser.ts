import { User } from '@fishprovider/core-new';
import { MongoUserRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { getUserService } from '~controllers/container';
import { ApiHandler } from '~types/ApiHandler.model';
import { requireLogin } from '~utils/apiHandler';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  requireLogin(userSession);

  const params = z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
  }).strict()
    .parse(data);

  const result = await getUserService().getUser(
    { user: MongoUserRepository },
    params,
    userSession,
  );
  return { result };
};

export default handler;
