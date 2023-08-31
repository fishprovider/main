import { GetNewsService } from '../..';

export const getNewsService: GetNewsService = async ({
  filter, options, repositories,
}) => repositories.news.getNews(filter, options);
