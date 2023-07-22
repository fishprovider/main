import { refreshUserRolesController } from '@fishprovider/adapter-backend';
import { refreshUserRolesUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default refreshUserRolesController(refreshUserRolesUseCase(
  MongoUserRepository,
  MongoAccountRepository,
));
