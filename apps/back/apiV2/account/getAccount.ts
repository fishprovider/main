import { ApiHandler, GetAccountController } from '@fishprovider/adapter-backend';
import { GetAccountUseCase } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { MongoAccountRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<Partial<User>> = new GetAccountController(
  new GetAccountUseCase(MongoAccountRepository),
).run;

export default handler;
