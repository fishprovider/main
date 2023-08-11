import { ApiHandlerRequest, GetNewsController } from '@fishprovider/adapter-backend';
import { GetNewsUseCase } from '@fishprovider/application';
import { CacheFirstNewsRepository } from '@fishprovider/framework-cache-first';

export default (params: ApiHandlerRequest) => {
  const getNewsController = new GetNewsController(
    new GetNewsUseCase(CacheFirstNewsRepository),
  );
  return getNewsController.run(params);
};
