import { UserError } from '@fishprovider/enterprise';

import type { UserSession } from '~types';

export const requireLogin = (user?: UserSession) => {
  if (!user?._id) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }
};
