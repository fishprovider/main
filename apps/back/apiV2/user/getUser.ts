import { getUserController } from '@fishprovider/adapter-backend';
import { getUserUseCase } from '@fishprovider/application-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default getUserController(getUserUseCase(MongoUserRepository));
