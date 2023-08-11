import { ApiHandlerRequest, JoinAccountController } from '@fishprovider/adapter-backend';
import { JoinAccountUseCase } from '@fishprovider/application';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const joinAccountController = new JoinAccountController(
    new JoinAccountUseCase(
      MongoAccountRepository,
      MongoUserRepository,
    ),
  );
  return joinAccountController.run(params);
};
