import { joinAccountController } from '@fishprovider/adapter-backend';
import { getAccountUseCase, internalUpdateAccountUseCase, internalUpdateUserUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default joinAccountController(
  getAccountUseCase(MongoAccountRepository),
  internalUpdateAccountUseCase(MongoAccountRepository),
  internalUpdateUserUseCase(MongoUserRepository),
);
