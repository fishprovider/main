import { checkRepository } from '@fishprovider/base-services';
import { News } from '@fishprovider/core';
import { DataFetchNewsRepository } from '@fishprovider/data-fetch';

export const watchNewsService = <T>(
  selector: (state: Record<string, News>) => T,
) => {
  const watchNewsRepo = checkRepository(DataFetchNewsRepository.watchNews);
  return watchNewsRepo(selector);
};
