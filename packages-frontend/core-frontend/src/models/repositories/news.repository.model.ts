import {
  News,
} from '@fishprovider/core';

import { RepositoryGetManyResult, RepositoryGetOptions, RepositoryUpdateOptions } from '..';

export interface NewsRepository {
  getNews?: (
    filter: {
      today?: boolean,
      week?: string,
      upcoming?: boolean,
    },
    options?: RepositoryGetOptions<News>,
  ) => Promise<RepositoryGetManyResult<News>>;

  updateNews?: (
    filter: {
      today?: boolean,
      week?: string,
      upcoming?: boolean,
    },
    payload: {
      news?: Partial<News>[],
    },
    options?: RepositoryUpdateOptions<News>,
  ) => Promise<RepositoryGetManyResult<News>>;

  watchNews?: <T>(
    selector: (state: Record<string, News>) => T,
  ) => T;
}
