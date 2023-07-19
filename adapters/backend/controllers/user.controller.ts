import type { GetUserUseCase, UpdateUserUseCase } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { ApiHandler, ApiHandlerParams } from '~types';

export const getUserController = (
  getUserUseCase: GetUserUseCase,
): ApiHandler<User> => async (
  { userSession }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const user = await getUserUseCase({
    userId: userSession._id,
  });
  return user;
};

export const updateUserController = (
  updateUserUseCase: UpdateUserUseCase,
): ApiHandler<boolean> => async (
  { userSession, data }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const payload = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    starProviders: z.record(z.boolean()).optional(),
  }).parse(data);

  const res = await updateUserUseCase({
    userId: userSession._id,
    payload,
  });
  return res;
};
