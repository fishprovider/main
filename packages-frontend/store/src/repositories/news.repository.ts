import { NewsRepository } from '@fishprovider/core-frontend';
import _ from 'lodash';
import moment from 'moment';

import { storeNews } from '..';

const getNews: NewsRepository['getNews'] = async (filter) => {
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
    return { docs: _.filter(storeNews.getState(), { week }) };
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

  return { docs: [] };
};

const updateNews: NewsRepository['updateNews'] = async (_filter, payload) => {
  const { news } = payload;
  if (news) {
    storeNews.mergeDocs(news);
  }
  return { docs: news };
};

const watchNews: NewsRepository['watchNews'] = storeNews.useStore;

export const StoreNewsRepository: NewsRepository = {
  getNews,
  updateNews,
  watchNews,
};
