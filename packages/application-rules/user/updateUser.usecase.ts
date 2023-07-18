import { User, UserError, UserSession } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

export const updateUserAllowEditFields: Array<keyof User> = [
  'name',
  'picture',
  'starProviders',
];
export type UpdateUserAllowEditFields = typeof updateUserAllowEditFields[number];

export interface UpdateUserUseCaseParams {
  payload: Partial<Pick<User, UpdateUserAllowEditFields>>,
}

export const updateUserUseCase = async (
  userRepository: UserRepository,
  userSession: UserSession,
  params: UpdateUserUseCaseParams,
) => {
  if (!userSession) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }

  const res = await userRepository.updateUser({
    ...params,
    _id: userSession._id,
    payload: _.pick(params.payload, updateUserAllowEditFields),
  });
  return res;
};
