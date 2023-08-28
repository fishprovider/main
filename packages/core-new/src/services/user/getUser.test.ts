import {
  BaseError,
  RepositoryError,
  ServiceError,
  UserError,
  UserService,
} from '../..';
import { containerServiceDefault, userRepoDefault, userSessionDefault } from '../../tests';

test('getUser with bad request', async () => {
  const userService = new UserService(containerServiceDefault);
  await expect(userService.getUser(
    { user: userRepoDefault },
    {},
    userSessionDefault,
  )).rejects.toThrow(new BaseError(ServiceError.SERVICE_BAD_REQUEST));
});

test('getUser throws no user', async () => {
  const userService = new UserService(containerServiceDefault);
  await expect(userService.getUser(
    { user: userRepoDefault },
    {
      userId: 'testId',
    },
    userSessionDefault,
  )).rejects.toThrow(new BaseError(UserError.USER_NOT_FOUND));
});

test('getUser throws bad result', async () => {
  const userId = 'testId';
  const userService = new UserService(containerServiceDefault);
  await expect(userService.getUser(
    {
      user: {
        ...userRepoDefault,
        getUser: async () => ({ _id: userId, pushNotif: [] }),
      },
    },
    {
      userId,
    },
    userSessionDefault,
  )).rejects.toThrow(new BaseError(RepositoryError.REPOSITORY_BAD_RESULT, 'projection', { _id: userId, pushNotif: [] }));
});

test('getUser returns a user', async () => {
  const userId = 'testId';
  const userService = new UserService(containerServiceDefault);
  const user = await userService.getUser(
    {
      user: {
        ...userRepoDefault,
        getUser: async () => ({ _id: userId }),
      },
    },
    {
      userId,
    },
    userSessionDefault,
  );
  expect(user).toBeDefined();
  expect(user?._id).toBe(userId);
});
