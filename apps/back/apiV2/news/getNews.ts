import { ApiHandler, GetNewsController } from '@fishprovider/adapter-backend';
import { GetNewsUseCase } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import { CacheFirstNewsRepository } from '@fishprovider/framework-cache-first';

const handler: ApiHandler<News[]> = new GetNewsController(
  new GetNewsUseCase(CacheFirstNewsRepository),
).run;

export default handler;
