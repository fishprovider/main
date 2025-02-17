import {
  AccountError, BaseError, checkRepository, getRoleProvider,
} from '@fishprovider/core';
import _ from 'lodash';

import {
  checkAccountAccess, checkLogin, checkProjection,
  UpdateAccountService,
} from '../..';

export const updateAccountService: UpdateAccountService = async ({
  filter, payload, options, repositories, context,
}) => {
  //
  // pre-check
  //
  const userSession = checkLogin(context?.userSession);
  const getAccountRepo = checkRepository(repositories.account.getAccount);
  const updateAccountRepo = checkRepository(repositories.account.updateAccount);

  //
  // main
  //
  const { roles } = userSession;
  const { accountId } = filter;
  const {
    viewType, name, icon, strategyId, notes, privateNotes, bannerStatus,
    tradeSettings, protectSettings, settings,
    addMember, removeMemberEmail,
    ...rest
  } = payload;

  const {
    isAdminAccount, isTraderAccount, isProtectorAccount, isViewerAccount,
  } = getRoleProvider(roles, accountId);
  if (!isViewerAccount) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }

  const { doc: account } = await getAccountRepo(filter, {
    projection: {
      _id: 1,
      members: 1,
    },
  });
  checkAccountAccess(account, context);

  if ((viewType || name || icon || strategyId || notes || privateNotes || bannerStatus)
    && !(isTraderAccount || isProtectorAccount)) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if (tradeSettings && !isTraderAccount) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if (protectSettings && !isProtectorAccount) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if ((settings || addMember || removeMemberEmail) && !isAdminAccount) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }
  if (_.size(_.omit(rest, ['addActivity']))) {
    throw new BaseError(AccountError.ACCOUNT_ACCESS_DENIED, accountId);
  }

  const { doc: accountNew } = await updateAccountRepo(filter, payload, options);

  checkProjection(options?.projection, accountNew);

  return {
    doc: {
      ...accountNew,
      _id: accountId,
    },
  };
};
