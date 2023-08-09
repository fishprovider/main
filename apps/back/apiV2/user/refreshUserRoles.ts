import { ApiHandlerRequest, RefreshUserRolesController } from '@fishprovider/adapter-backend';
import { RefreshUserRolesUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const refreshUserRolesController = new RefreshUserRolesController(
    new RefreshUserRolesUseCase(
      MongoUserRepository,
      MongoAccountRepository,
    ),
  );
  return refreshUserRolesController.run(params);
};
