import { ApiHandler, GetUserController } from '@fishprovider/adapter-backend';
import { GetUserUseCase } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const getUserController = new GetUserController(
  new GetUserUseCase(MongoUserRepository),
);

const handler: ApiHandler<Partial<User>> = getUserController.run;

export default handler;
