import { joinAccountController } from '@fishprovider/adapter-backend';
import { updateAccountUseCase, updateUserUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default joinAccountController(
  updateAccountUseCase(MongoAccountRepository),
  updateUserUseCase(MongoUserRepository),
);
