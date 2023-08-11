import { ApiHandlerRequest, RefreshUserStarProvidersController } from '@fishprovider/adapter-backend';
import { RefreshUserStarProvidersUseCase } from '@fishprovider/application';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const refreshUserStarProvidersController = new RefreshUserStarProvidersController(
    new RefreshUserStarProvidersUseCase(MongoUserRepository),
  );
  return refreshUserStarProvidersController.run(params);
};
