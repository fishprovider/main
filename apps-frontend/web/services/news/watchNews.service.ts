import { checkRepository, News } from '@fishprovider/core';
import { LocalFirstNewsRepository } from '@fishprovider/local-first';

export const watchNewsService = <T>(
  selector: (state: Record<string, News>) => T,
) => {
  const watchNewsRepo = checkRepository(LocalFirstNewsRepository.watchNews);
  return watchNewsRepo(selector);
};
