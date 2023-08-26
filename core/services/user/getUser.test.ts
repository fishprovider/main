import { UserError } from '@fishprovider/models';

import { UserService } from '.';

test('getUser will return user', async () => {
  const userId = '123';
  const userService = new UserService({
    userRepository: {
      getUser: async () => ({ _id: userId }),
      updateUser: async () => false,
      updateUserAccountRole: async () => false,
      updateUserStarProviders: async () => false,
      refreshUserRoles: async () => false,
    },
  });
  const user = await userService.getUser({
    userId,
  });
  expect(user._id).toBe(userId);
});

test('getUser will throw UserError.USER_NOT_FOUND', async () => {
  const userService = new UserService({
    userRepository: {
      getUser: async () => null,
      updateUser: async () => false,
      updateUserAccountRole: async () => false,
      updateUserStarProviders: async () => false,
      refreshUserRoles: async () => false,
    },
  });
  await expect(userService.getUser({
    userId: 'test',
  })).rejects.toThrow(UserError.USER_NOT_FOUND);
});

test('getUser will return user with projection', async () => {
  const userId = '123';
  const userService = new UserService({
    userRepository: {
      getUser: async () => ({ _id: userId, pushNotif: [] }),
      updateUser: async () => false,
      updateUserAccountRole: async () => false,
      updateUserStarProviders: async () => false,
      refreshUserRoles: async () => false,
    },
  });
  await expect(userService.getUser({
    userId,
  })).rejects.toThrow(UserError.USER_ACCESS_DENIED);
});
