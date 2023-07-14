import { send } from '@fishprovider/core/dist/libs/notif';
import type { News } from '@fishprovider/utils/dist/types/News.model';
import axios from 'axios';
import moment from 'moment';

const env = {
  typePre: process.env.TYPE_PRE,
};

interface NewsRes {
  title: string,
  country: string,
  date: string,
  impact: string,
  forecast: string,
  previous: string,
}

const loadNews = async (type: string, url: string) => {
  try {
    const week = 'this';

    const res = await axios.get<NewsRes[]>(url);

    const news = res.data.map((item, index) => {
      const datetime = moment(item.date).toDate();
      const impact = item.impact.toLowerCase();
      const currency = item.country;
      const _id = `${type}-${week}-${datetime.getTime()}-${currency || 'o'}-${index}`;
      return {
        ...item,

        _id,
        type,
        week,

        datetime,

        impact,
        currency,
      };
    });

    await Mongo.collection('news').deleteMany({ type, week });
    await Mongo.collection<News>('news').insertMany(news);
  } catch (err) {
    Logger.error('Failed in loadNews', type, url, err);
  }
};

const checkNews = async () => {
  try {
    const news = await Mongo.collection<News>('news').find({
      impact: { $in: ['high', 'medium'] },
      currency: { $exists: true },
      datetime: {
        $gte: new Date(),
        $lte: moment().add(1, 'hour').toDate(),
      },
    }).toArray();

    if (news.length) {
      const msg = news
        .map(({
          datetime, currency, impact, title,
        }) => {
          const datetimeText = moment(datetime).fromNow();
          let icon = '';
          if (impact === 'high') icon = '🔴';
          if (impact === 'medium') icon = '🟠';
          return `${datetimeText}, ${currency} ${icon}, ${title}`;
        })
        .join('\n');
      await send(msg, [], `${env.typePre}-news`);
    }

    await loadNews('forex', 'https://nfs.faireconomy.media/ff_calendar_thisweek.json');
    await loadNews('metal', 'https://nfs.faireconomy.media/mm_calendar_thisweek.json');
    await loadNews('energy', 'https://nfs.faireconomy.media/ee_calendar_thisweek.json');
    await loadNews('crypto', 'https://nfs.faireconomy.media/cc_calendar_thisweek.json');
  } catch (err) {
    Logger.error('Failed in checkNews', err);
  }
};

export default checkNews;
