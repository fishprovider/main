import { ApiHandlerRequest, GetUserController } from '@fishprovider/adapter-backend';
import { GetUserUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const getUserController = new GetUserController(
    new GetUserUseCase(MongoUserRepository),
  );
  return getUserController.run(params);
};
