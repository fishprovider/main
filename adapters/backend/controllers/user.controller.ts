import {
  getUserUseCase, updateUserUseCase, UserRepository,
} from '@fishprovider/application-rules';
import { z } from 'zod';

import { requireLogIn } from '~helpers';
import type { UserSession } from '~types';

async function getUser(
  userRepository: UserRepository,
  userSession: UserSession,
) {
  requireLogIn(userSession);

  const user = await getUserUseCase({
    userRepository,
    userId: userSession._id,
  });
  return user;
}

async function updateUser(
  userRepository: UserRepository,
  userSession: UserSession,
  data: any,
) {
  requireLogIn(userSession);

  const payload = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    starProviders: z.record(z.boolean()).optional(),
  }).refine((item) => item.name || item.picture || item.starProviders)
    .parse(data);

  const res = await updateUserUseCase({
    userRepository,
    userId: userSession._id,
    payload,
  });
  return res;
}

export const UserController = (
  userRepository: UserRepository,
  userSession: UserSession,
) => ({
  getUser: () => getUser(userRepository, userSession),
  updateUser: (data: any) => updateUser(userRepository, userSession, data),
});
