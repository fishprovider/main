import {
  checkAccountAccess, checkProjection, checkRepository, GetAccountsService,
  sanitizeAccountBaseGetOptions,
} from '../..';

export const getAccountsService: GetAccountsService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const getAccountsRepo = checkRepository(repositories.account.getAccounts);

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);

  const { docs: accounts } = await getAccountsRepo(filter, options);

  accounts?.forEach((account) => {
    checkProjection(options?.projection, account);
    checkAccountAccess(account, context);
  });

  return { docs: accounts };
};
