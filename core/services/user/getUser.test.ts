import {
  RepositoryError, ServiceError, UserError, userRepositoryDefault,
} from '@fishprovider/models';

import { UserService } from '.';

test('getUser with bad request', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  await expect(userService.getUser({
  })).rejects.toThrow(ServiceError.BAD_REQUEST);
});

test('getUser throws no user', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  await expect(userService.getUser({
    userId: 'testId',
  })).rejects.toThrow(UserError.USER_NOT_FOUND);
});

test('getUser throws bad result', async () => {
  const userId = 'testId';
  const userService = new UserService({
    userRepository: {
      ...userRepositoryDefault,
      getUser: async () => ({ _id: userId, pushNotif: [] }),
    },
  });
  await expect(userService.getUser({
    userId,
  })).rejects.toThrow(RepositoryError.BAD_RESULT);
});

test('getUser returns a user', async () => {
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
