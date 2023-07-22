import type {
  GetUserUseCase, GetUserUseCaseParams, UpdateUserUseCase, UpdateUserUseCaseParams,
} from '@fishprovider/application-rules';

export const getUserController = (
  getUserUseCase: GetUserUseCase,
) => async (
  params: GetUserUseCaseParams,
) => getUserUseCase(params);

export const updateUserController = (
  updateUserUseCase: UpdateUserUseCase,
) => async (
  params: UpdateUserUseCaseParams,
) => updateUserUseCase(params);
