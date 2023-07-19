import { getNewsController } from '@fishprovider/adapter-backend';
import { getNewsUseCase } from '@fishprovider/application-rules';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

export default getNewsController(getNewsUseCase(MongoNewsRepository));
