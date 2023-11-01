import { AccountRoles, checkRepository } from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, RemoveAccountService,
} from '../..';

export const removeAccountService: RemoveAccountService = async ({
  filter, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const removeAccountRepo = checkRepository(repositories.account.removeAccount);
  const updateTradeClientRepo = checkRepository(repositories.account.updateTradeClient);
  const updateUserRepo = checkRepository(repositories.user.updateUser);

  //
  // main
  //
  const { accountId } = filter;
  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
      accountPlatform: 1,
      'config.clientId': 1,
    },
  });
  const { accountPlatform, config } = checkAccountAccess(account, context);

  await removeAccountRepo(filter);

  await updateUserRepo({
    email: userSession.email,
  }, {
    removeRole: {
      role: AccountRoles.admin,
      accountId,
    },
  });

  if (accountPlatform && config?.clientId) {
    await updateTradeClientRepo({
      accountPlatform,
      clientId: config.clientId,
      addActiveAccounts: -1,
    });
  }

  // TODO: stop head
};
