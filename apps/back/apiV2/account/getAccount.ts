import { ApiHandler, GetAccountController } from '@fishprovider/adapter-backend';
import { GetAccountUseCase } from '@fishprovider/application-rules';
import type { User } from '@fishprovider/enterprise-rules';
import { MongoAccountRepository } from '@fishprovider/framework-mongo';

const getAccountController = new GetAccountController(
  new GetAccountUseCase(MongoAccountRepository),
);

const handler: ApiHandler<Partial<User>> = getAccountController.run;

export default handler;
