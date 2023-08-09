import { ApiHandlerRequest, GetAccountController } from '@fishprovider/adapter-backend';
import { GetAccountUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const getAccountController = new GetAccountController(
    new GetAccountUseCase(MongoAccountRepository),
  );
  return getAccountController.run(params);
};
