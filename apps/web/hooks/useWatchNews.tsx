import newsGetMany from '@fishprovider/cross/api/news/getMany';
import storeNews from '@fishprovider/cross/stores/news';
import storeUser from '@fishprovider/cross/stores/user';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';

const bannerIdBigNews = 'BigNews';
const bannerIdBigNewsNear = 'BigNewsNear';

export default function useWatchNews() {
  const getBigNews = async () => {
    const news = await newsGetMany({ upcoming: true });
    if (news.length) {
      storeUser.mergeState({
        banners: {
          ...storeUser.getState().banners,
          [bannerIdBigNews]: true,
        },
      });
    }

    const hasBigNews = _.some(
      storeNews.getState(),
      ({ impact, datetime }) => ['high', 'medium'].includes(impact)
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
}
