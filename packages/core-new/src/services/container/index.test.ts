import {
  BaseError,
  ContainerService,
  ServiceError,
  ServiceName,
  UserService,
} from '../..';

test('ContainerService', async () => {
  const container = new ContainerService();
  container.register(ServiceName.user, UserService);

  const { user } = container.services;
  expect(user).toBeDefined();
  expect(user).toBeInstanceOf(UserService);

  const extractService = user?.getService(ServiceName.user);
  expect(extractService).toBeDefined();
  expect(extractService).toBeInstanceOf(UserService);

  expect(() => user?.getService(ServiceName.account))
    .toThrow(new BaseError(ServiceError.SERVICE_UNKNOWN, ServiceName.account));
});
