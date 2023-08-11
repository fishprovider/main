import { ApiHandlerRequest, UpdateUserController } from '@fishprovider/adapter-backend';
import { UpdateUserUseCase } from '@fishprovider/application';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default (params: ApiHandlerRequest) => {
  const updateUserController = new UpdateUserController(
    new UpdateUserUseCase(MongoUserRepository),
  );
  return updateUserController.run(params);
};
