import {
  DefaultNewsRepository, type GetNewsRepositoryParams,
  type NewsRepository,
  type SetNewsRepositoryParams,
  type WatchNewsRepositoryParams,
} from '@fishprovider/application-rules';
import _ from 'lodash';
import moment from 'moment';

import { storeNews } from '~stores';

async function setNews(params: SetNewsRepositoryParams) {
  storeNews.mergeDocs(params.news);
  return true;
}

async function getNews(params: GetNewsRepositoryParams) {
  const { today, week, upcoming } = params;

  if (today) {
    return _.filter(
      storeNews.getState(),
      ({ datetime }) => moment(datetime) >= moment()
        && moment(datetime) <= moment().add(1, 'day'),
    );
  }

  if (week) {
    return _.filter(
      storeNews.getState(),
      (item) => item.week === week,
    );
  }

  if (upcoming) {
    return _.filter(
      storeNews.getState(),
      ({ impact, datetime }) => ['high', 'medium'].includes(impact)
        && moment(datetime) > moment().subtract(1, 'hour')
        && moment(datetime) < moment().add(1, 'hour'),
    );
  }

  return null;
}

function watchNews<T>(params: WatchNewsRepositoryParams<T>) {
  const { selector } = params;
  return storeNews.useStore(selector);
}

export const StoreNewsRepository: NewsRepository = {
  ...DefaultNewsRepository,
  setNews,
  getNews,
  watchNews,
};
