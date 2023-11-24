import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';

import { getNewsController } from '~controllers/news.controller';
import { getUserInfoController, updateUserInfoController } from '~controllers/user.controller';

const bannerIdBigNews = 'BigNews';
const bannerIdBigNewsNear = 'BigNewsNear';

function NewsWatch() {
  const getBigNews = async () => {
    const news = await getNewsController({
      upcoming: true,
    });
    if (news?.length) {
      updateUserInfoController({
        banners: {
          ...getUserInfoController().banners,
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
      updateUserInfoController({
        banners: {
          ...getUserInfoController().banners,
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
