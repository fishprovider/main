import {
  BaseError, RepositoryError, UserError,
} from '@fishprovider/core-new';

import {
  getUserService,
} from '../..';
import { userServiceBaseParams } from '../../tests';

test('getUser with bad request', async () => {
  await expect(getUserService({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('getUser throws bad result', async () => {
  const userId = 'testId';
  const badDoc = { _id: userId, pushNotif: [] };
  await expect(getUserService({
    ...userServiceBaseParams,
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        getUser: async () => ({ doc: badDoc }),
      },
    },
  })).rejects.toThrow(new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', badDoc));
});

test('getUser returns a user', async () => {
  const userId = 'testId';
  const { doc: user } = await getUserService({
    ...userServiceBaseParams,
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        getUser: async () => ({ doc: { _id: userId } }),
      },
    },
  });
  expect(user).toBeDefined();
  expect(user?._id).toBe(userId);
});
