import { News } from '@fishprovider/core';
import { watchNewsService } from '@fishprovider/services';
import { StoreNewsRepository } from '@fishprovider/store';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: StoreNewsRepository,
    },
  });
