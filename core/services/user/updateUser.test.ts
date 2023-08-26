import { ServiceError, userRepositoryDefault } from '@fishprovider/models';

import { UserService } from '.';

test('updateUser with bad request', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  await expect(userService.updateUser({
  })).rejects.toThrow(ServiceError.BAD_REQUEST);
});

test('updateUser updates starProviders with bad request', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  await expect(userService.updateUser({
    userId: 'testId',
    starProviders: {},
  })).rejects.toThrow(ServiceError.BAD_REQUEST);
});

test('updateUser returns a doc', async () => {
  const userId = 'testId';
  const name = 'testName';
  const userService = new UserService({
    userRepository: {
      ...userRepositoryDefault,
      updateUser: async () => ({ _id: userId, name }),
    },
  });
  const res = await userService.updateUser({
    userId,
    name,
    returnDoc: true,
  });
  expect(res._id).toBe(userId);
  expect(res.name).toBe(name);
});
