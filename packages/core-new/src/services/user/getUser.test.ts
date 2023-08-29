import {
  BaseError, getUser, RepositoryError, UserError,
} from '../..';
import { userServiceBaseParams, userSessionDefault } from '../../tests';

test('getUser with bad request', async () => {
  await expect(getUser({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('getUser throws bad result', async () => {
  const userId = 'testId';
  const badDoc = { _id: userId, pushNotif: [] };
  await expect(getUser({
    ...userServiceBaseParams,
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        getUser: async () => badDoc,
      },
    },
  })).rejects.toThrow(new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', badDoc));
});

test('getUser returns a user', async () => {
  const userId = 'testId';
  const user = await getUser({
    ...userServiceBaseParams,
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        getUser: async () => ({ _id: userId }),
      },
    },
  });
  expect(user).toBeDefined();
  expect(user?._id).toBe(userId);
});
