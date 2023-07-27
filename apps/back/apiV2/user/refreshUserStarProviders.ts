import { ApiHandler, RefreshUserStarProvidersController } from '@fishprovider/adapter-backend';
import { RefreshUserStarProvidersUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<boolean> = new RefreshUserStarProvidersController(
  new RefreshUserStarProvidersUseCase(MongoUserRepository),
).run;

export default handler;
