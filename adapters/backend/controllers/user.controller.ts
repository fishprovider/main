import {
  getUserUseCase, updateUserUseCase, UserRepository,
} from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { ApiHandlerParams } from '~types';

export const getUser = (
  userRepository: UserRepository,
) => async (
  { userSession }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const user = await getUserUseCase({
    userRepository,
    userId: userSession._id,
  });
  return user;
};

export const updateUser = (
  userRepository: UserRepository,
) => async (
  { userSession, data }: ApiHandlerParams,
) => {
  requireLogIn(userSession);

  const payload = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    starProviders: z.record(z.boolean()).optional(),
  }).parse(data);

  const res = await updateUserUseCase({
    userRepository,
    userId: userSession._id,
    payload,
  });
  return res;
};
