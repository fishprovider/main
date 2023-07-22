import { AccountRoles, type User } from '@fishprovider/enterprise-rules';
import _ from 'lodash';

import type { AccountRepository } from '~usecases/account';

import type { UpdateUserRepositoryParams, UserRepository } from './_user.repository';

export interface RefreshUserRolesUseCaseParams extends UpdateUserRepositoryParams {
  user: Partial<User>;
}

export type RefreshUserRolesUseCase = (
  params: RefreshUserRolesUseCaseParams
) => Promise<boolean>;

export const refreshUserRolesUseCase = (
  userRepository: UserRepository,
  accountRepository: AccountRepository,
): RefreshUserRolesUseCase => async (
  params: RefreshUserRolesUseCaseParams,
) => {
  const { user } = params;

  const roles = user.roles || {};

  const cleanDisabledProviders = () => {
    _.forEach(roles.adminProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.adminProviders, accountId);
      }
    });
    _.forEach(roles.traderProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.traderProviders, accountId);
      }
    });
    _.forEach(roles.protectorProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.protectorProviders, accountId);
      }
    });
    _.forEach(roles.viewerProviders, (enabled, accountId) => {
      if (!enabled) {
        _.unset(roles.viewerProviders, accountId);
      }
    });
  };
  cleanDisabledProviders();

  const cleanRoleProviders = async () => {
    const accountIds = _.uniq([
      ..._.keys(roles.adminProviders),
      ..._.keys(roles.traderProviders),
      ..._.keys(roles.protectorProviders),
      ..._.keys(roles.viewerProviders),
    ]);

    for (const accountId of accountIds) {
      const account = await accountRepository.getAccount({
        accountId,
        query: {
          'members.userId': user._id,
        },
        projection: {
          members: 1,
        },
      });
      if (!account) {
        _.unset(roles.adminProviders, accountId);
        _.unset(roles.traderProviders, accountId);
        _.unset(roles.protectorProviders, accountId);
        _.unset(roles.viewerProviders, accountId);
      } else {
        const { members } = account;
        const member = _.find(members, (item) => item.userId === user._id);
        switch (member?.role) {
          case AccountRoles.admin: {
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.trader: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.protector: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.viewerProviders, accountId);
            break;
          }
          case AccountRoles.viewer: {
            _.unset(roles.adminProviders, accountId);
            _.unset(roles.traderProviders, accountId);
            _.unset(roles.protectorProviders, accountId);
            break;
          }
          default:
        }
      }
    }
  };
  await cleanRoleProviders();

  const res = await userRepository.updateUser({
    userId: user._id,
    payload: {
      roles,
    },
  });
  return res;
};
