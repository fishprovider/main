import { updateAccountInviteController } from '@fishprovider/adapter-backend';
import { updateAccountUseCase, updateUserUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default updateAccountInviteController(
  updateAccountUseCase(MongoAccountRepository),
  updateUserUseCase(MongoUserRepository),
);
