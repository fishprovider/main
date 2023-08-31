import { GetNewsFilter, News, NewsRepository } from '@fishprovider/core-new';
import _ from 'lodash';
import moment from 'moment';

import { storeNews } from '..';

const getNews = async (filter: GetNewsFilter) => {
  const { today, week, upcoming } = filter;

  if (today) {
    return {
      docs: _.filter(
        storeNews.getState(),
        ({ datetime }) => moment(datetime) >= moment()
          && moment(datetime) <= moment().add(1, 'day'),
      ),
    };
  }

  if (week) {
    return {
      docs: _.filter(
        storeNews.getState(),
        (item) => item.week === week,
      ),
    };
  }

  if (upcoming) {
    return {
      docs: _.filter(
        storeNews.getState(),
        ({ impact, datetime }) => ['high', 'medium'].includes(impact)
          && moment(datetime) > moment().subtract(1, 'hour')
          && moment(datetime) < moment().add(1, 'hour'),
      ),
    };
  }

  return { docs: null };
};

const watchNews = <T>(
  selector: (state: Record<string, News>) => T,
) => storeNews.useStore(selector);

export const StoreNewsRepository: NewsRepository = {
  getNews,
  watchNews,
};
