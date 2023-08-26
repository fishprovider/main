import type { WatchNewsParams } from '@fishprovider/models';

import { NewsService } from '.';

export const watchNews = (
  userService: NewsService,
) => async <T>(params: WatchNewsParams<T>) => {
  const { newsRepository } = userService;
  return newsRepository.watchNews(params);
};
