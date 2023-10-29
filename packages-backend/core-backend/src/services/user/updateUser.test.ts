import { BaseError, UserError } from '@fishprovider/core';

import { updateUserService } from '../..';
import { userServiceBaseParams, userSessionDefault } from '../../tests';

test('updateUser throws USER_ACCESS_DENIED', async () => {
  await expect(updateUserService({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('updateUser returns a user', async () => {
  const name = 'testNameNew';
  const user = {
    ...userSessionDefault,
    name,
  };
  const { doc } = await updateUserService({
    ...userServiceBaseParams,
    payload: {
      name,
    },
    repositories: {
      user: {
        updateUser: async () => ({ doc: user }),
      },
    },
  });
  expect(doc?._id).toBe(userSessionDefault._id);
  expect(doc?.name).toBe(name);
});
