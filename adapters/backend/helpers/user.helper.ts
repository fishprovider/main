import { UserError } from '@fishprovider/enterprise-rules';

import type { UserSession } from '~types';

export function requireLogIn(userSession: UserSession) {
  if (!userSession?._id) {
    throw new Error(UserError.USER_ACCESS_DENIED);
  }
}
