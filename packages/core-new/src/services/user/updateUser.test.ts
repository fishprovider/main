import { BaseError, updateUser, UserError } from '../..';
import { userServiceBaseParams, userSessionDefault } from '../../tests';

test('updateUser with bad request', async () => {
  await expect(updateUser({
    ...userServiceBaseParams,
    context: undefined,
  })).rejects.toThrow(new BaseError(UserError.USER_ACCESS_DENIED));
});

test('updateUser returns a doc', async () => {
  const name = 'new name';
  const res = await updateUser({
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
