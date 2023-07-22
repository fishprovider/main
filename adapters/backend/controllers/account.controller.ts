import type {
  GetAccountUseCase, JoinAccountUseCase,
} from '@fishprovider/application-rules';
import type { Account } from '@fishprovider/enterprise-rules';
import _ from 'lodash';
import { z } from 'zod';

import { requireLogin } from '~helpers';
import type { ApiHandler } from '~types';

export const getAccountController = (
  getAccountUseCase: GetAccountUseCase,
): ApiHandler<Partial<Account>> => async ({ userSession, data }) => {
  requireLogin(userSession);

  const payload = z.object({
    accountId: z.string().nonempty(),
  }).strict()
    .parse(data);

  const result = await getAccountUseCase(payload);
  return { result };
};

export const joinAccountController = (
  joinAccountUseCase: JoinAccountUseCase,
): ApiHandler<boolean> => async ({ userSession, data }) => {
  requireLogin(userSession);

  const payload = z.object({
    accountId: z.string().nonempty(),
  }).strict()
    .parse(data);

  const userNew = await joinAccountUseCase({
    ...payload,
    user: userSession,
  });
  const userSessionNew = {
    ...userSession,
    ...userNew,
  };
  return { result: true, userSessionNew };
};
