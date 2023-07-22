import { refreshUserStarProvidersController } from '@fishprovider/adapter-backend';
import { refreshUserStarProvidersUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default refreshUserStarProvidersController(refreshUserStarProvidersUseCase(
  MongoUserRepository,
));
