import { checkRepository } from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, RemoveAccountService, sanitizeOutputAccount,
} from '../..';

export const removeAccountService: RemoveAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const removeAccountRepo = checkRepository(repositories.account.removeAccount);
  const updateTradeClientRepo = checkRepository(repositories.account.updateTradeClient);
  const removeTradeAccountRepo = checkRepository(repositories.trade.removeAccount);
  const updateUsersRepo = checkRepository(repositories.user.updateUsers);

  //
  // main
  //
  const { accountId } = filter;
  const { doc: accountRaw } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
      platform: 1,
      tradeType: 1,
      'config.clientId': 1,
    },
  });
  const account = checkAccountAccess(accountRaw, context);

  await removeTradeAccountRepo({ accountId });

  await removeAccountRepo(filter);

  await updateUsersRepo({}, { removeRoleAccountId: accountId });

  const { platform, config } = account;
  if (platform && config?.clientId) {
    await updateTradeClientRepo({
      platform,
      clientId: config.clientId,
      addActiveAccounts: -1,
    });
  }

  return {
    doc: sanitizeOutputAccount(accountRaw),
  };
};
