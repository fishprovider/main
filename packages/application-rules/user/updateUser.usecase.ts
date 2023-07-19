import { User, UserError, UserSession } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

export const updateUserAllowEditFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];
export type UpdateUserAllowEditFields = typeof updateUserAllowEditFields[number];

export type UpdateUserUseCasePayload = Partial<Pick<User, UpdateUserAllowEditFields>>;

export interface UpdateUserUseCaseParams {
  userRepository: UserRepository,
  userSession: UserSession,
  payload: UpdateUserUseCasePayload,
}

export const updateUserUseCase = async (params: UpdateUserUseCaseParams) => {
  const { userRepository, userSession, payload } = params;
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const res = await userRepository.updateUser({
    _id: userSession._id,
    payload: _.pick(payload, updateUserAllowEditFields),
  });
  return res;
};
