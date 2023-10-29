import {
  News,
} from '@fishprovider/core';

import {
  BaseGetManyResult, BaseGetOptions,
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

  watchNews?: <T>(
    selector: (state: Record<string, News>) => T,
  ) => T;
}
