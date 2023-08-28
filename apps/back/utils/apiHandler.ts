import { UserError, UserSession } from '@fishprovider/core-new';

export const requireLogin = (userSession?: UserSession) => {
  if (!userSession?._id) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }
};
