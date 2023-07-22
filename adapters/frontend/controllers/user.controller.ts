import type { GetUserUseCase, UpdateUserUseCase } from '@fishprovider/application-rules';

export const getUserController = (
  getUserUseCase: GetUserUseCase,
) => getUserUseCase;

export const updateUserController = (
  updateUserUseCase: UpdateUserUseCase,
) => updateUserUseCase;
