import { ApiHandler, RefreshUserRolesController } from '@fishprovider/adapter-backend';
import { RefreshUserRolesUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<boolean> = new RefreshUserRolesController(
  new RefreshUserRolesUseCase(
    MongoUserRepository,
    MongoAccountRepository,
  ),
).run;

export default handler;
