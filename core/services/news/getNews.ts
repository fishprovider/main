import type { GetNewsParams } from '@fishprovider/models';

import { NewsService } from '.';

export const getNews = (
  userService: NewsService,
) => async (params: GetNewsParams) => {
  const { newsRepository } = userService;
  return newsRepository.getNews(params) || [];
};
