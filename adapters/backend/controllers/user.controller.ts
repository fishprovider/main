import type { GetUserUseCase, UpdateUserUseCase } from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { ApiHandlerParams } from '~types';

export const getUserController = (
  getUserUseCase: GetUserUseCase,
) => async (
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
) => async (
  { userSession, data }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const payload = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    starProviders: z.record(z.boolean()).optional(),
  }).strict()
    .parse(data);

  const res = await updateUserUseCase({
    userId: userSession._id,
    payload,
  });
  return res;
};
