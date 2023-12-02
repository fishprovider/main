import {
  User,
} from '@fishprovider/core';

export const sanitizeOutputUser = (user?: Partial<User>) => ({
  ...user,
  pushNotif: undefined,
});
