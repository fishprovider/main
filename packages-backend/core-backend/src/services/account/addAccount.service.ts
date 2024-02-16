import {
  AccountConfig, AccountError, AccountRole, AccountViewType, BaseError, checkRepository,
} from '@fishprovider/core';
import _ from 'lodash';

import {
  AddAccountService, checkLogin,
} from '../..';

export const addAccountService: AddAccountService = async ({
  payload, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const checkAccountRepo = checkRepository(repositories.account.checkAccount);
  const addAccountRepo = checkRepository(repositories.account.addAccount);
  const getTradeClientRepo = checkRepository(repositories.account.getTradeClient);
  const updateTradeClientRepo = checkRepository(repositories.account.updateTradeClient);
  const addTradeAccountRepo = checkRepository(repositories.trade.addAccount);
  const updateUserRepo = checkRepository(repositories.user.updateUser);

  //
  // main
  //
  const {
    name, providerType, platform, tradeType, baseConfig,
  } = payload;

  if (!name || !providerType || !platform || !baseConfig) {
    throw new BaseError(AccountError.ACCOUNT_BAD_REQUEST);
  }

  if (!/^[a-zA-Z0-9][a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/i.test(name)) {
    throw new BaseError(
      AccountError.ACCOUNT_BAD_REQUEST,
      'Invalid account name: only alphanumeric, space, dash, underscore are allowed',
    );
  }

  const accountId = _.replace(name, /\s+/g, '_').toLowerCase();

  const { found } = await checkAccountRepo({
    accountId,
    name,
    providerAccountId: baseConfig.accountId,
  });
  if (found) {
    throw new BaseError(AccountError.ACCOUNT_BAD_REQUEST, 'Account name already exists');
  }

  const { doc: client } = await getTradeClientRepo({
    platform,
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

  const { doc: tradeAccount } = await addTradeAccountRepo({
    accountId: '',
    name,
    config,
    providerType,
    platform,
    tradeType,
    viewType: AccountViewType.private,
    members: [],
  });
  if (tradeAccount?.config?.accountId) {
    config.accountId = tradeAccount.config.accountId;
  }

  const { doc: account } = await addAccountRepo({
    accountId,
    config,
    name,
    providerType,
    platform,
    tradeType,
    viewType: AccountViewType.private,
    members: [{
      email: userSession.email,
      name: userSession.name,
      picture: userSession.picture,
      role: AccountRole.admin,
      updatedAt: new Date(),
      createdAt: new Date(),
    }],
  });

  await updateUserRepo({
    email: userSession.email,
  }, {
    addRole: {
      role: AccountRole.admin,
      accountId,
    },
  });

  await updateTradeClientRepo({
    platform,
    clientId,
    addActiveAccounts: 1,
  });

  return {
    doc: {
      ...account,
      _id: accountId,
    },
  };
};
