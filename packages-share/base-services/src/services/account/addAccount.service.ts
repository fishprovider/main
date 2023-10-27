import {
  AccountConfig, AccountError, AccountPlatform, AccountRoles, AccountSourceType,
  AccountTradeType, AccountViewType, BaseError,
} from '@fishprovider/core';
import _ from 'lodash';

import {
  AddAccountService, checkLogin, checkRepository, sanitizeOutputAccount,
} from '../..';

export const addAccountService: AddAccountService = async ({
  payload, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const getTradeClientRepo = checkRepository(repositories.account.getTradeClient);
  const addTradeAccountRepo = checkRepository(repositories.trade.addTradeAccount);
  const addAccountRepo = checkRepository(repositories.account.addAccount);

  //
  // main
  //
  const {
    name, accountType, accountPlatform,
    clientId, tradeAccountId,
    host, port, accessToken, refreshToken,
    user, pass, platform, server,
  } = payload;

  if (!name || !accountType || !accountPlatform) {
    throw new BaseError(AccountError.ACCOUNT_BAD_REQUEST);
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/i.test(name)) {
    throw new BaseError(
      AccountError.ACCOUNT_BAD_REQUEST,
      'Invalid account name: only alphanumeric, space, dash, underscore are allowed',
    );
  }

  const accountId = _.replace(name, /\s+/g, '_').toLowerCase();

  const { doc: accountExisted } = await getAccountRepo({
    orFilter: {
      accountId,
      name,
      tradeAccountId,
    },
  });
  if (accountExisted) {
    throw new BaseError(AccountError.ACCOUNT_BAD_REQUEST, 'Account name already exists');
  }

  const config: AccountConfig = {
    clientId: clientId ?? '',
    clientSecret: '',
    accountId: tradeAccountId ?? '',
    name,
    // ct
    ...(host && { host }),
    ...(port && { port }),
    ...(accessToken && { accessToken }),
    ...(refreshToken && { refreshToken }),
    // mt
    ...(user && { user }),
    ...(pass && { pass }),
    ...(platform && { platform }),
    ...(server && { server }),
  };

  const { doc: client } = await getTradeClientRepo({ accountType, accountPlatform });
  if (!client) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Failed to get trade client');
  }
  config.clientId = client.clientId ?? '';
  config.clientSecret = client.clientSecret ?? '';

  switch (accountPlatform) {
    case AccountPlatform.metatrader: {
      const { doc: tradeConfig } = await addTradeAccountRepo({
        config,
        // ct
        ...(host && { host }),
        ...(port && { port }),
        ...(accessToken && { accessToken }),
        ...(refreshToken && { refreshToken }),
        // mt
        ...(user && { user }),
        ...(pass && { pass }),
        ...(platform && { platform }),
        ...(server && { server }),
      });
      if (!tradeConfig) {
        throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Failed to add trade account');
      }
      config.accountId = tradeConfig.accountId;
      break;
    }
    default:
  }

  const { doc: account } = await addAccountRepo({
    accountId,
    config,
    name,
    accountType,
    accountPlatform,
    accountViewType: AccountViewType.private,
    accountTradeType: AccountTradeType.demo,
    sourceType: AccountSourceType.user,
    members: [{
      email: userSession.email,
      name: userSession.name,
      picture: userSession.picture,
      role: AccountRoles.admin,
      updatedAt: new Date(),
      createdAt: new Date(),
    }],
    userId: userSession._id,
    userEmail: userSession.email,
    userName: userSession.name,
    userPicture: userSession.picture,
    updatedAt: new Date(),
    createdAt: new Date(),
  });

  return {
    doc: sanitizeOutputAccount(account),
  };
};
