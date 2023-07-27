import { ApiHandler, GetUserController } from '@fishprovider/adapter-backend';
import { GetUserUseCase } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<Partial<User>> = new GetUserController(
  new GetUserUseCase(MongoUserRepository),
).run;

export default handler;
