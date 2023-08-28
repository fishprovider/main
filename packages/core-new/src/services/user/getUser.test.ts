import {
  BaseError,
  ContainerService,
  containerServiceDefault,
  RepositoryError,
  ServiceError,
  UserError,
  userRepoDefault,
  UserService,
} from '../..';

test('getUser with bad request', async () => {
  const userService = new UserService(userRepoDefault, new ContainerService());
  await expect(userService.getUser({
  })).rejects.toThrow(new BaseError(ServiceError.SERVICE_BAD_REQUEST));
});

test('getUser throws no user', async () => {
  const userService = new UserService(userRepoDefault, containerServiceDefault);
  await expect(userService.getUser({
    userId: 'testId',
  })).rejects.toThrow(new BaseError(UserError.USER_NOT_FOUND));
});

test('getUser throws bad result', async () => {
  const userId = 'testId';
  const userService = new UserService({
    ...userRepoDefault,
    getUser: async () => ({ _id: userId, pushNotif: [] }),
  }, containerServiceDefault);
  await expect(userService.getUser({
    userId,
  })).rejects.toThrow(new BaseError(RepositoryError.REPOSITORY_BAD_RESULT));
});

test('getUser returns a user', async () => {
  const userId = 'testId';
  const userService = new UserService({
    ...userRepoDefault,
    getUser: async () => ({ _id: userId }),
  }, containerServiceDefault);
  const user = await userService.getUser({
    userId,
  });
  expect(user).toBeDefined();
  expect(user?._id).toBe(userId);
});
