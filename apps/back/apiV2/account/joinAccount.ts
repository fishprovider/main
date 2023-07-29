import { ApiHandler, JoinAccountController } from '@fishprovider/adapter-backend';
import { JoinAccountUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

const joinAccountController = new JoinAccountController(
  new JoinAccountUseCase(
    MongoAccountRepository,
    MongoUserRepository,
  ),
);

const handler: ApiHandler<boolean> = joinAccountController.run;

export default handler;
