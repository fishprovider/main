import { getNewsController } from '@fishprovider/adapter-backend';
import { getNewsUseCase } from '@fishprovider/application-rules';
import { CacheFirstNewsRepository } from '@fishprovider/framework-cache-first';

export default getNewsController(getNewsUseCase(CacheFirstNewsRepository));
