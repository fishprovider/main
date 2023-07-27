import { ApiHandler, UpdateUserController } from '@fishprovider/adapter-backend';
import { UpdateUserUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<boolean> = new UpdateUserController(
  new UpdateUserUseCase(MongoUserRepository),
).run;

export default handler;
