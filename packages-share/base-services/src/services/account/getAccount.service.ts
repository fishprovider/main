import {
  checkAccountAccess, checkProjection, checkRepository, GetAccountService,
  sanitizeOutputAccount,
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
  const { doc: account } = await getAccountRepo(filter, options);

  checkProjection(options?.projection, account);
  checkAccountAccess(account, context);

  return {
    doc: sanitizeOutputAccount(account),
  };
};
