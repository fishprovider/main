import { News } from '@fishprovider/core';
import { StoreNewsRepository } from '@fishprovider/data-fetching';
import { watchNewsService } from '@fishprovider/services';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: StoreNewsRepository,
    },
  });
