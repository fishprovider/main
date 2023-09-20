import { getNewsService } from '@fishprovider/base-services';
import { DataFetchNewsRepository } from '@fishprovider/data-fetch';

export const getNewsController = (filter: {
  week?: string,
  upcoming?: boolean,
}) => getNewsService({
  filter,
  options: {},
  repositories: {
    news: DataFetchNewsRepository,
  },
});
