import {
  checkAccountAccess, checkProjection, checkRepository, GetAccountService,
  sanitizeAccountBaseGetOptions,
} from '../..';

export const getAccountService: GetAccountService = async ({
  filter, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  const getAccountRepo = checkRepository(repositories.account.getAccount);

  //
  // main
  //
  const options = context?.internal
    ? optionsRaw
    : sanitizeAccountBaseGetOptions(optionsRaw);

  const { doc: account } = await getAccountRepo(filter, options);

  checkProjection(options?.projection, account);
  checkAccountAccess(account, context);

  return { doc: account };
};
