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
  const { accountId } = filter;
  const options = sanitizeAccountBaseGetOptions(optionsRaw);

  const { doc: account } = await getAccountRepo(filter, options);

  checkProjection(options?.projection, account);
  checkAccountAccess(account, context);

  return {
    doc: {
      ...account,
      _id: accountId,
      config: undefined, // never leak config
    },
  };
};
