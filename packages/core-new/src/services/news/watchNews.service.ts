import { WatchNewsService } from '../..';

export const watchNewsService: WatchNewsService = ({
  selector, repositories,
}) => repositories.news.watchNews(selector);
