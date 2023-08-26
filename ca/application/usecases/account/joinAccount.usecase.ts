import {
  AccountError, AccountMember, AccountRoles, type User,
} from '@fishprovider/models';
import _ from 'lodash';

import type { AccountRepository, GetAccountRepositoryParams, UserRepository } from '~repositories';

export interface JoinAccountUseCaseParams extends GetAccountRepositoryParams {
  accountId: string,
  user: Partial<User> & {
    _id: string,
    name: string,
  };
}

export class JoinAccountUseCase {
  accountRepository: AccountRepository;
  userRepository: UserRepository;

  constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository,
  ) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async run(
    params: JoinAccountUseCaseParams,
  ): Promise<Partial<User>> {
    const { accountId, user } = params;

    const account = await this.accountRepository.getAccount(params);
    if (!account) {
      throw new Error(AccountError.ACCOUNT_NOT_FOUND);
    }

    const { memberInvites } = account;
    const memberInvite = memberInvites?.find(({ email }) => email === user.email);
    if (!memberInvite) {
      throw new Error(AccountError.ACCOUNT_ACCESS_DENIED);
    }

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
    await this.userRepository.updateUser({
      email,
      payload: setRoles,
      payloadDelete: deleteRoles,
    });

    const member: AccountMember = {
      ...memberInvite,
      userId: user._id,
      name: user.name,
      picture: user.picture,
      updatedAt: new Date(),
    };
    await this.accountRepository.updateAccount({
      accountId,
      payloadPull: {
        memberInvites: {
          email,
        },
      },
      payloadPush: {
        members: member,
      },
    });

    const userNew = user;
    Object.entries(setRoles).forEach(([path, value]) => {
      _.set(userNew, path, value);
    });
    Object.keys(deleteRoles).forEach((path) => {
      _.unset(userNew, path);
    });
    return userNew;
  }
}
