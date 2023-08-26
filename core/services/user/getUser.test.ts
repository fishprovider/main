import { UserError, userRepositoryDefault } from '@fishprovider/models';

import { UserService } from '.';

test('getUser will return user', async () => {
  const userId = 'testId';
  const userService = new UserService({
    userRepository: {
      ...userRepositoryDefault,
      getUser: async () => ({ _id: userId }),
    },
  });
  const user = await userService.getUser({
    userId,
  });
  expect(user._id).toBe(userId);
});

test('getUser will throw UserError.USER_NOT_FOUND', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  await expect(userService.getUser({
    userId: 'testId',
  })).rejects.toThrow(UserError.USER_NOT_FOUND);
});

test('getUser will return user with projection', async () => {
  const userId = 'testId';
  const userService = new UserService({
    userRepository: {
      ...userRepositoryDefault,
      getUser: async () => ({ _id: userId, pushNotif: [] }),
    },
  });
  await expect(userService.getUser({
    userId,
  })).rejects.toThrow(UserError.USER_ACCESS_DENIED);
});
