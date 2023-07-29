import { ApiHandler, UpdateUserController } from '@fishprovider/adapter-backend';
import { UpdateUserUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const updateUserController = new UpdateUserController(
  new UpdateUserUseCase(MongoUserRepository),
);

const handler: ApiHandler<boolean> = updateUserController.run;

export default handler;
