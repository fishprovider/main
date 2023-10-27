import {
  checkAccountAccess, checkLogin, checkRepository, RemoveAccountService,
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

  await removeAccountRepo(filter);
};
