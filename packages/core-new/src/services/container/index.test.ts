import {
  ContainerService,
  ServiceName,
  userRepoDefault,
  UserService,
} from '../..';

test('ContainerService', async () => {
  const container = new ContainerService();
  container.register(ServiceName.user, UserService, userRepoDefault);

  const { user } = container.services;
  expect(user).toBeDefined();
  expect(user).toBeInstanceOf(UserService);

  const extractService = user?.getService(ServiceName.user);
  expect(extractService).toBeDefined();
  expect(extractService).toBeInstanceOf(UserService);

  expect(() => user?.getService(ServiceName.account))
    .toThrow('Unknown Service account');
});
