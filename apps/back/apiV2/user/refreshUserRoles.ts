import { ApiHandler, RefreshUserRolesController } from '@fishprovider/adapter-backend';
import { RefreshUserRolesUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

const refreshUserRolesController = new RefreshUserRolesController(
  new RefreshUserRolesUseCase(
    MongoUserRepository,
    MongoAccountRepository,
  ),
);

const handler: ApiHandler<boolean> = refreshUserRolesController.run;

export default handler;
