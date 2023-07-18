import { User, UserError, UserSession } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

const allowEditFields = [
  'name',
  'picture',
  'starProviders',
];

export interface UpdateUserUseCaseParams {
  payload: Partial<Omit<User, '_id'>>,
  options?: {
    returnAfter?: boolean,
  },
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
    payload: {
      ..._.pick(
        params.payload,
        allowEditFields,
      ),
    },
  });
  return res;
};
