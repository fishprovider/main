import { joinAccountController } from '@fishprovider/adapter-backend';
import { joinAccountUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository, MongoUserRepository } from '@fishprovider/framework-mongo';

export default joinAccountController(joinAccountUseCase(
  MongoAccountRepository,
  MongoUserRepository,
));
