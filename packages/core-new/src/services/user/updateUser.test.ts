import {
  BaseError,
  ServiceError,
  userRepoDefault,
  UserService,
} from '../..';

test('updateUser with bad request', async () => {
  const userService = new UserService(userRepoDefault);
  await expect(userService.updateUser({
  })).rejects.toThrow(new BaseError(ServiceError.SERVICE_BAD_REQUEST));
});

test('updateUser returns a doc', async () => {
  const userId = 'testId';
  const name = 'testName';
  const userService = new UserService({
    ...userRepoDefault,
    updateUser: async () => ({ _id: userId, name }),
  });
  const res = await userService.updateUser({
    userId,
    name,
    returnDoc: true,
  });
  expect(res._id).toBe(userId);
  expect(res.name).toBe(name);
});
