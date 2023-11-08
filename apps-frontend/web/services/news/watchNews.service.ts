import { checkRepository, News } from '@fishprovider/core';
import { StoreFirstNewsRepository } from '@fishprovider/store-first';

export const watchNewsService = <T>(
  selector: (state: Record<string, News>) => T,
) => {
  const watchNewsRepo = checkRepository(StoreFirstNewsRepository.watchNews);
  return watchNewsRepo(selector);
};
