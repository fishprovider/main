import { BaseError, UserError } from '@fishprovider/core';

import { getUserService } from '../..';
import { userServiceBaseParams } from '../../tests';

test('getUser throws USER_ACCESS_DENIED', async () => {
  await expect(getUserService({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('getUser returns a user', async () => {
  const user = { _id: 'userId' };
  const { doc } = await getUserService({
    ...userServiceBaseParams,
    repositories: {
      user: {
        getUser: async () => ({ doc: user }),
      },
    },
  });
  expect(doc?._id).toBe(user._id);
});
