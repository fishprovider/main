import { OfflineFirstNewsRepository } from '@fishprovider/data-fetching';
import { getNewsService } from '@fishprovider/services';

export const getNewsController = (filter: {
  week?: string,
  upcoming?: boolean,
}) => getNewsService({
  filter,
  options: {},
  repositories: {
    news: OfflineFirstNewsRepository,
  },
});
