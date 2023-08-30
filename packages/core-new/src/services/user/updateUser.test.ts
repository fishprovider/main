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
  const { doc } = await updateUserService({
    ...userServiceBaseParams,
    payload: {
      name,
      returnDoc: true,
    },
    repositories: {
      user: {
        ...userServiceBaseParams.repositories.user,
        updateUser: async () => ({
          doc: {
            ...userSessionDefault,
            name,
          },
        }),
      },
    },
  });
  expect(doc?._id).toBe(userSessionDefault._id);
  expect(doc?.name).toBe(name);
});
