import { News } from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions, BaseUpdateOptions,
} from '..';

export interface NewsRepository {
  getNews?: (
    filter: {
      today?: boolean,
      week?: string,
      upcoming?: boolean,
    },
    options?: BaseGetOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  updateNews?: (
    filter: {
      today?: boolean,
      week?: string,
      upcoming?: boolean,
    },
    payload: {
      news?: Partial<News>[],
    },
    options?: BaseUpdateOptions<News>,
  ) => Promise<BaseGetManyResult<News>>;

  watchNews?: <T>(
    selector: (state: Record<string, News>) => T,
  ) => T;
}
