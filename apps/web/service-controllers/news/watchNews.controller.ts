import { News } from '@fishprovider/core-new';
import { StoreNewsRepository } from '@fishprovider/repository-store';
import { watchNewsService } from '@fishprovider/services';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: StoreNewsRepository,
    },
  });
