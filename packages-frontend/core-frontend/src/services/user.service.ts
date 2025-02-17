import { checkRepository } from '@fishprovider/core';

import {
  GetUserInfoService, GetUserService, UpdateUserInfoService,
  UpdateUserService, WatchUserInfoService, WatchUserService,
} from '..';

export const getUserInfoService: GetUserInfoService = ({
  repositories,
}) => {
  const getUserInfoRepo = checkRepository(repositories.user.getUserInfo);
  return getUserInfoRepo();
};

export const updateUserInfoService: UpdateUserInfoService = ({
  payload, repositories,
}) => {
  const updateUserInfoRepo = checkRepository(repositories.user.updateUserInfo);
  updateUserInfoRepo(payload);
};

export const watchUserInfoService: WatchUserInfoService = ({
  selector, repositories,
}) => {
  const watchUserInfoRepo = checkRepository(repositories.user.watchUserInfo);
  return watchUserInfoRepo(selector);
};

//
//
//

export const getUserService: GetUserService = async ({
  filter, repositories, options,
}) => {
  const getUserRepo = checkRepository(repositories.user.getUser);
  const res = await getUserRepo(filter, options);

  updateUserInfoService({
    payload: {
      activeUser: {
        ...getUserInfoService({ repositories }).activeUser,
        ...res.doc,
      },
    },
    repositories,
  });
  return res;
};

export const updateUserService: UpdateUserService = async ({
  filter, payload, repositories, options,
}) => {
  const updateUserRepo = checkRepository(repositories.user.updateUser);
  const res = await updateUserRepo(filter, payload, options);

  updateUserInfoService({
    payload: {
      activeUser: {
        ...getUserInfoService({ repositories }).activeUser,
        ...res.doc,
      },
    },
    repositories,
  });

  return res;
};

export const watchUserService: WatchUserService = ({
  selector, repositories,
}) => {
  const watchUserRepo = checkRepository(repositories.user.watchUser);
  return watchUserRepo(selector);
};
