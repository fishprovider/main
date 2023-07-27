import { ApiHandler, JoinAccountController } from '@fishprovider/adapter-backend';
import { JoinAccountUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

const handler: ApiHandler<boolean> = new JoinAccountController(
  new JoinAccountUseCase(
    MongoAccountRepository,
    MongoUserRepository,
  ),
).run;

export default handler;
