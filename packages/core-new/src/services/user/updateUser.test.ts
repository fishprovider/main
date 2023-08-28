import {
  BaseError,
  ServiceError,
  UserService,
} from '../..';
import { containerServiceDefault, userRepoDefault, userSessionDefault } from '../../tests';

test('updateUser with bad request', async () => {
  const userService = new UserService(containerServiceDefault);
  await expect(userService.updateUser(
    { user: userRepoDefault },
    {},
    userSessionDefault,
  )).rejects.toThrow(new BaseError(ServiceError.SERVICE_BAD_REQUEST));
});

test('updateUser returns a doc', async () => {
  const userId = 'testId';
  const name = 'testName';
  const userService = new UserService(containerServiceDefault);
  const res = await userService.updateUser(
    {
      user: {
        ...userRepoDefault,
        updateUser: async () => ({ _id: userId, name }),
      },
    },
    {
      userId,
      name,
      returnDoc: true,
    },
    userSessionDefault,
  );
  expect(res._id).toBe(userId);
  expect(res.name).toBe(name);
});
