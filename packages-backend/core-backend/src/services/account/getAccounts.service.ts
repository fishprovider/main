import {
  checkAccountAccess, checkProjection, checkRepository, GetAccountsService, sanitizeOutputAccount,
} from '../..';

export const getAccountsService: GetAccountsService = async ({
  filter, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const getAccountsRepo = checkRepository(repositories.account.getAccounts);

  //
  // main
  //
  const { docs: accounts } = await getAccountsRepo(filter, options);

  accounts?.forEach((account) => {
    checkProjection(options?.projection, account);
    checkAccountAccess(account, context);
  });

  return {
    docs: accounts?.map(sanitizeOutputAccount),
  };
};
