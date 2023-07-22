import type {
  GetAccountUseCase, UpdateAccountUseCase, UpdateUserUseCase,
} from '@fishprovider/application-rules';
import {
  Account, AccountMember, AccountRoles,
} from '@fishprovider/enterprise-rules';
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

export const updateAccountInviteController = (
  getAccountUseCase: GetAccountUseCase,
  updateAccountUseCase: UpdateAccountUseCase,
  updateUserUseCase: UpdateUserUseCase,
): ApiHandler<Partial<Account>> => async ({ userSession, data }) => {
  requireLogin(userSession);

  const payload = z.object({
    accountId: z.string().nonempty(),
    memberInvite: z.object({
      email: z.string().email(),
      role: z.nativeEnum(AccountRoles),
      createdAt: z.date(),
    }),
  }).strict()
    .parse(data);

  const { accountId, memberInvite } = payload;

  const { email, role } = memberInvite;

  const setRoles = {
    ...(role === AccountRoles.admin && {
      [`roles.adminProviders.${accountId}`]: true,
    }),
    ...(role === AccountRoles.trader && {
      [`roles.traderProviders.${accountId}`]: true,
    }),
    ...(role === AccountRoles.protector && {
      [`roles.protectorProviders.${accountId}`]: true,
    }),
    ...(role === AccountRoles.viewer && {
      [`roles.viewerProviders.${accountId}`]: true,
    }),
  };
  const deleteRoles = {
    ...(role !== AccountRoles.admin && {
      [`roles.adminProviders.${accountId}`]: '',
    }),
    ...(role !== AccountRoles.trader && {
      [`roles.traderProviders.${accountId}`]: '',
    }),
    ...(role !== AccountRoles.protector && {
      [`roles.protectorProviders.${accountId}`]: '',
    }),
    ...(role !== AccountRoles.viewer && {
      [`roles.viewerProviders.${accountId}`]: '',
    }),
  };

  await updateUserUseCase({
    isInternal: true,
    email,
    payload: setRoles,
    payloadDelete: deleteRoles,
  });

  const userSessionNew = userSession;
  Object.entries(setRoles).forEach(([path, value]) => {
    _.set(userSessionNew, path, value);
  });
  Object.keys(deleteRoles).forEach((path) => {
    _.unset(userSessionNew, path);
  });

  const member: AccountMember = {
    ...memberInvite,
    userId: userSession._id,
    name: userSession.name,
    picture: userSession.picture,
    updatedAt: new Date(),
  };
  await updateAccountUseCase({
    isInternal: true,
    payloadPull: {
      memberInvites: {
        email,
      },
    },
    payloadPush: {
      members: member,
    },
  });

  const result = await getAccountUseCase({
    isInternal: true,
    accountId,
    projection: {
      memberInvites: 1,
      members: 1,
    },
  });
  return { result, userSessionNew };
};
