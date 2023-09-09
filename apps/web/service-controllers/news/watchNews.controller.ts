import { StoreNewsRepository } from '@fishprovider/repository-store';
import { watchNewsService } from '@fishprovider/services';
import { News } from '@fishprovider-new/core';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: StoreNewsRepository,
    },
  });
