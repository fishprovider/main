import { AccountRoles, updateUserService, User } from '@fishprovider/core-new';
import { MongoUserRepository } from '@fishprovider/repository-mongo';
import { z } from 'zod';

import { ApiHandler } from '~types/ApiHandler.model';

const handler: ApiHandler<Partial<User>> = async (data, userSession) => {
  const params = z.object({
    userId: z.string().optional(),
    email: z.string().optional(),
    name: z.string().optional(),
    picture: z.string().optional(),
    roles: z.object({
      admin: z.boolean().optional(),
      adminWeb: z.boolean().optional(),
      managerWeb: z.boolean().optional(),
      adminProviders: z.record(z.boolean()).optional(),
      protectorProviders: z.record(z.boolean()).optional(),
      traderProviders: z.record(z.boolean()).optional(),
      viewerProviders: z.record(z.boolean()).optional(),
    }).optional(),
    starProvider: z.object({
      accountId: z.string(),
      enabled: z.boolean(),
    }).optional(),
    addRole: z.object({
      accountId: z.string(),
      role: z.nativeEnum(AccountRoles),
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
