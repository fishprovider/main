import type {
  GetUserUseCase, RefreshUserRolesUseCase, RefreshUserStarProvidersUseCase, UpdateUserUseCase,
} from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandler } from '~types';

export const getUserController = (
  getUserUseCase: GetUserUseCase,
): ApiHandler<Partial<User>> => async ({ userSession }) => {
  requireLogin(userSession);

  const result = await getUserUseCase({
    userId: userSession._id,
  });
  return { result };
};

export const updateUserController = (
  updateUserUseCase: UpdateUserUseCase,
): ApiHandler<boolean> => async ({ userSession, data }) => {
  requireLogin(userSession);

  const payload = z.object({
    name: z.string().optional(),
    picture: z.string().optional(),
    starProviders: z.record(z.boolean()).optional(),
  }).strict()
    .parse(data);

  const result = await updateUserUseCase({
    userId: userSession._id,
    payload,
  });
  return { result };
};

export const refreshUserRolesController = (
  refreshUserRolesUseCase: RefreshUserRolesUseCase,
): ApiHandler<boolean> => async ({ userSession }) => {
  requireLogin(userSession);

  const result = await refreshUserRolesUseCase({
    user: userSession,
  });
  return { result };
};

export const refreshUserStarProvidersController = (
  refreshUserStarProvidersUseCase: RefreshUserStarProvidersUseCase,
): ApiHandler<boolean> => async ({ userSession }) => {
  requireLogin(userSession);

  const result = await refreshUserStarProvidersUseCase({
    user: userSession,
  });
  return { result };
};
