import { updateUserController } from '@fishprovider/adapter-backend';
import { updateUserUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default updateUserController(updateUserUseCase(MongoUserRepository));
