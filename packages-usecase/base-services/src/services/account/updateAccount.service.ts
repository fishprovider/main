import {
  checkLogin,
  checkProjection,
  checkRepository,
  getAccountService, sanitizeAccountBaseGetOptions,
  UpdateAccountService,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options: optionsRaw, repositories, context,
}) => {
  //
  // pre-check
  //
  checkLogin(context?.userSession);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  await getAccountService({
    filter,
    options: {
      projection: {
        _id: 1,
        members: 1,
        memberInvites: 1,
      },
    },
    repositories,
    context,
  });

  //
  // main
  //
  const options = sanitizeAccountBaseGetOptions(optionsRaw);
  const { doc: account } = await updateAccountRepo(filter, payload, options);

  checkProjection(options?.projection, account);

  return { doc: account };
};
