import { checkRepository } from '@fishprovider/core';

import {
  checkAccountAccess, checkProjection, GetAccountService,
} from '../..';

export const getAccountService: GetAccountService = async ({
  filter, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const getAccountRepo = checkRepository(repositories.account.getAccount);

  //
  // main
  //
  const { accountId } = filter;
  const { doc: account } = await getAccountRepo(filter, options);

  checkProjection(options?.projection, account);
  checkAccountAccess(account, context);

  return {
    doc: {
      ...account,
      _id: accountId,
    },
  };
};
