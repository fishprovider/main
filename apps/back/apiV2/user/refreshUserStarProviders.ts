import { ApiHandler, RefreshUserStarProvidersController } from '@fishprovider/adapter-backend';
import { RefreshUserStarProvidersUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const refreshUserStarProvidersController = new RefreshUserStarProvidersController(
  new RefreshUserStarProvidersUseCase(MongoUserRepository),
);

const handler: ApiHandler<boolean> = refreshUserStarProvidersController.run;

export default handler;
