import { BaseError, updateUserService, UserError } from '../..';
import { userServiceBaseParams, userSessionDefault } from '../../tests';

test('updateUser with bad request', async () => {
  await expect(updateUserService({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('updateUser returns a doc', async () => {
  const name = 'new name';
  const res = await updateUserService({
    ...userServiceBaseParams,
    params: {
      name,
      returnDoc: true,
    },
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        updateUser: async () => ({
          ...userSessionDefault,
          name,
        }),
      },
    },
  });
  expect(res._id).toBe(userSessionDefault._id);
  expect(res.name).toBe(name);
});
