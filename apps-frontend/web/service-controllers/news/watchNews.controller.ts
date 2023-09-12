import { watchNewsService } from '@fishprovider/base-services';
import { News } from '@fishprovider/core';
import { StoreNewsRepository } from '@fishprovider/data-fetching';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: StoreNewsRepository,
    },
  });
