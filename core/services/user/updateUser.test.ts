import { userRepositoryDefault } from '@fishprovider/models';

import { UserService } from '.';

test('updateUser will not return doc', async () => {
  const userService = new UserService({
    userRepository: userRepositoryDefault,
  });
  const res = await userService.updateUser({
    userId: 'testId',
    name: 'testName',
  });
  expect(res._id).toBeUndefined();
});

test('updateUser will return doc', async () => {
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
