import { watchNewsService } from '@fishprovider/base-services';
import { News } from '@fishprovider/core';
import { DataFetchNewsRepository } from '@fishprovider/data-fetch';

export const watchNewsController = <T>(
  selector: (state: Record<string, News>) => T,
) => watchNewsService<T>({
    selector,
    repositories: {
      news: DataFetchNewsRepository,
    },
  });
