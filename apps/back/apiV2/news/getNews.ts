import { ApiHandler, GetNewsController } from '@fishprovider/adapter-backend';
import { GetNewsUseCase } from '@fishprovider/application-rules';
import type { News } from '@fishprovider/enterprise-rules';
import { CacheFirstNewsRepository } from '@fishprovider/framework-cache-first';

const getNewsController = new GetNewsController(
  new GetNewsUseCase(CacheFirstNewsRepository),
);

const handler: ApiHandler<News[]> = getNewsController.run;

export default handler;
