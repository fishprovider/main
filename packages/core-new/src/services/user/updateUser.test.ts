import {
  BaseError,
  ServiceError,
  UserService,
} from '../..';
import { containerServiceDefault, userRepoDefault, userSessionDefault } from '../../tests';

test('updateUser with bad request', async () => {
  const userService = new UserService(userRepoDefault, containerServiceDefault);
  await expect(userService.updateUser({
  }, userSessionDefault)).rejects.toThrow(new BaseError(ServiceError.SERVICE_BAD_REQUEST));
});

test('updateUser returns a doc', async () => {
  const userId = 'testId';
  const name = 'testName';
  const userService = new UserService({
    ...userRepoDefault,
    updateUser: async () => ({ _id: userId, name }),
  }, containerServiceDefault);
  const res = await userService.updateUser({
    userId,
    name,
    returnDoc: true,
  }, userSessionDefault);
  expect(res._id).toBe(userId);
  expect(res.name).toBe(name);
});
