import { checkProjection, checkRepository, UpdateAccountService } from '@fishprovider/core';

import {
  checkAccountAccess, checkLogin, sanitizeOutputAccount,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  //
  // main
  //
  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
    },
  });
  checkAccountAccess(account, context);

  const { accountId } = filter;
  const { doc: accountNew } = await updateAccountRepo(filter, payload, options);

  checkProjection(options?.projection, accountNew);

  return {
    doc: {
      ...sanitizeOutputAccount(accountNew),
      _id: accountId,
    },
  };
};
