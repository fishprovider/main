import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';

import { getNewsController } from '~controllers/news.controller';

const bannerIdBigNews = 'BigNews';
const bannerIdBigNewsNear = 'BigNewsNear';

function NewsWatch() {
  const getBigNews = async () => {
    const news = await getNewsController({
      upcoming: true,
    });
    if (news?.length) {
      storeUser.mergeState({
        banners: {
          ...storeUser.getState().banners,
          [bannerIdBigNews]: true,
        },
      });
    }

    const allNews = await getNewsController({});
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
