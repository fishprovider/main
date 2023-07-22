import { getAccountController } from '@fishprovider/adapter-backend';
import { getAccountUseCase } from '@fishprovider/application-rules';
import { MongoAccountRepository } from '@fishprovider/framework-mongo';

export default getAccountController(getAccountUseCase(MongoAccountRepository));
