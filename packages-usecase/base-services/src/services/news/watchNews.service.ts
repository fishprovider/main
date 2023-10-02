import { checkRepository, WatchNewsService } from '../..';

export const watchNewsService: WatchNewsService = ({
  selector, repositories,
}) => {
  //
  // pre-check
  //
  const watchNewsRepo = checkRepository(repositories.news.watchNews);

  //
  // main
  //
  return watchNewsRepo(selector);
};
