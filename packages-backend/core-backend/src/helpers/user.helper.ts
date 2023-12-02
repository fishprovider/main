import {
  BaseError, UserError,
} from '@fishprovider/core';

import {
  UserSession,
} from '..';

export const checkLogin = (userSession?: UserSession) => {
  if (!userSession?._id) {
    throw new BaseError(UserError.USER_ACCESS_DENIED);
  }
  return userSession;
};
