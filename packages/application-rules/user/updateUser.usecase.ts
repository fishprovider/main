import { User, UserError, UserSession } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { UserRepository } from './user.repository';

const allowEditFields = [
  'name',
  'picture',
  'starProviders',
];

export const updateUserUseCase = async (
  userRepository: UserRepository,
  userSession: UserSession,
  params: {
    payload: Partial<Omit<User, '_id'>>,
    options?: {
      returnAfter?: boolean,
    },
  },
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
