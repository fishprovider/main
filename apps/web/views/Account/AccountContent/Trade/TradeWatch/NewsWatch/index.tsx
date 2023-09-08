import storeUser from '@fishprovider/cross/dist/stores/user';
import { OfflineFirstNewsRepository } from '@fishprovider/repository-offline-first';
import { StoreNewsRepository } from '@fishprovider/repository-store';
import { getNewsService } from '@fishprovider/services';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';

const bannerIdBigNews = 'BigNews';
const bannerIdBigNewsNear = 'BigNewsNear';

function NewsWatch() {
  const getBigNews = async () => {
    const { docs: news } = await getNewsService({
      filter: {
        upcoming: true,
      },
      options: {},
      repositories: {
        news: OfflineFirstNewsRepository,
      },
    });
    if (news?.length) {
      storeUser.mergeState({
        banners: {
          ...storeUser.getState().banners,
          [bannerIdBigNews]: true,
        },
      });
    }

    const { docs: allNews } = await getNewsService({
      filter: {},
      options: {},
      repositories: {
        news: StoreNewsRepository,
      },
    });
    const hasBigNews = _.some(
      allNews,
      ({ impact, datetime }) => impact
        && ['high', 'medium'].includes(impact)
        && moment(datetime) > moment().subtract(1, 'hour')
        && moment(datetime) < moment().add(1, 'hour'),
    );
    if (hasBigNews) {
      storeUser.mergeState({
        banners: {
          ...storeUser.getState().banners,
          [bannerIdBigNewsNear]: true,
        },
      });
    }
  };

  useEffect(() => {
    getBigNews();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getBigNews();
    }, 1000 * 60 * 5); // 5 mins
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return null;
}

export default NewsWatch;
