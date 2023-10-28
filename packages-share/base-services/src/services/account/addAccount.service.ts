import {
  AccountConfig, AccountError, AccountRoles, AccountSourceType,
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
    name, accountType, accountPlatform, baseConfig,
  } = payload;

  if (!name || !accountType || !accountPlatform || !baseConfig) {
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
      tradeAccountId: baseConfig.accountId,
    },
  });
  if (accountExisted) {
    throw new BaseError(AccountError.ACCOUNT_BAD_REQUEST, 'Account name already exists');
  }

  const { doc: client } = await getTradeClientRepo({
    accountType,
    accountPlatform,
    clientId: baseConfig.clientId,
  });
  if (!client) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Failed to get trade client');
  }
  const { clientId, clientSecret } = client;
  if (!clientId || !clientSecret) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Missing clientId or clientSecret');
  }

  const config: AccountConfig = {
    ...baseConfig,
    clientId,
    clientSecret,
    name,
  };

  const { doc: tradeConfig } = await addTradeAccountRepo({ accountPlatform, config });
  if (!tradeConfig) {
    throw new BaseError(AccountError.ACCOUNT_NOT_FOUND, 'Failed to add trade account');
  }
  config.accountId = tradeConfig.accountId;

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
