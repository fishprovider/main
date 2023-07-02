import delay from '@fishbot/utils/helpers/delay';
import moment from 'moment';
import type { Page } from 'puppeteer-core';

import { gotoAttempt, newBrowser, newPage } from '~libs/pup';

const env = {
  typePre: process.env.TYPE_PRE,
  nodeEnv: process.env.NODE_ENV,
  pupProduct: process.env.PUPPETEER_PRODUCT || 'chrome',
};

const parseTime = (rows: any[], week: string, type: string) => rows.map((row, index: number) => {
  const datetime = moment.utc(`${row.date} ${row.time}`.trim(), ['ddd MMM D', 'ddd MMM D h:mma']);
  return {
    ...row,
    _id: `${type}-${week}-${datetime.unix()}-${row.currency || 'o'}-${index}`,
    datetime: datetime.toDate(),
    week,
    type,
  };
});

const getForexNews = async (week: string, page: Page) => {
  await gotoAttempt(async () => {
    await page.goto(`https://www.forexfactory.com/calendar?week=${week}`, {
      waitUntil: 'networkidle2',
    });
  });
  await delay(10000);

  const rows = await page.$eval('.calendar__table tbody', (tbody) => {
    let lastDate: string;
    let lastTime: string;
    return Array.from(tbody.children)
      .filter((ele: any) => ele.classList.contains('calendar_row'))
      .map((ele: any) => {
        const row = Array.from(ele.children) as any[];
        lastDate = row[0]?.innerText.trim().replace('\n', ' ') || lastDate;
        lastTime = row[1]?.innerText.trim() || lastTime;
        return {
          date: lastDate,
          time: lastTime,
          currency: row[3]?.innerText.trim(),
          impact: row[4]?.querySelector('span')?.title?.split(' ')[0]?.toLowerCase(),
          title: row[5]?.innerText.trim(),
          forecast: row[8]?.innerText.trim(),
          previous: row[9]?.innerText.trim(),
        };
      });
  });
  const news = parseTime(rows, week, 'forex');

  if (news.length) {
    Logger.debug(news[0]);
    await Mongo.collection('news').deleteMany({ week, type: 'forex' });
    await Mongo.collection('news').insertMany(news);
  }
  Logger.debug(`[${week}-week] Found ${news.length} forex news`);
  return news;
};

const getMetalNews = async (week: string, page: Page) => {
  await gotoAttempt(async () => {
    await page.goto(`https://www.metalsmine.com/calendar?week=${week}`, {
      waitUntil: 'networkidle2',
    });
  });
  await delay(10000);

  const rows = await page.$eval('.calendar__table tbody', (tbody) => {
    let lastDate: string;
    let lastTime: string;
    return Array.from(tbody.children)
      .filter((ele: any) => ele.classList.contains('calendar_row'))
      .map((ele: any) => {
        const row = Array.from(ele.children) as any[];
        lastDate = row[0]?.innerText.trim().replace('\n', ' ') || lastDate;
        lastTime = row[1]?.innerText.trim() || lastTime;
        return {
          date: lastDate,
          time: lastTime,
          impact: row[3]?.querySelector('span')?.title?.split(' ')[0]?.toLowerCase(),
          title: row[4]?.innerText.trim(),
          forecast: row[7]?.innerText.trim(),
          previous: row[8]?.innerText.trim(),
        };
      });
  });
  const news = parseTime(rows, week, 'metal');

  if (news.length) {
    Logger.debug(news[0]);
    await Mongo.collection('news').deleteMany({ week, type: 'metal' });
    await Mongo.collection('news').insertMany(news);
  }
  Logger.debug(`[${week}-week] Found ${news.length} metal news`);
  return news;
};

const getEnergyNews = async (week: string, page: Page) => {
  await gotoAttempt(async () => {
    await page.goto(`https://www.energyexch.com/calendar?week=${week}`, {
      waitUntil: 'networkidle2',
    });
  });
  await delay(10000);

  const rows = await page.$eval('.calendar__table tbody', (tbody) => {
    let lastDate: string;
    let lastTime: string;
    return Array.from(tbody.children)
      .filter((ele: any) => ele.classList.contains('calendar_row'))
      .map((ele: any) => {
        const row = Array.from(ele.children) as any[];
        lastDate = row[0]?.innerText.trim().replace('\n', ' ') || lastDate;
        lastTime = row[1]?.innerText.trim() || lastTime;
        return {
          date: lastDate,
          time: lastTime,
          impact: row[3]?.querySelector('span')?.title?.split(' ')[0]?.toLowerCase(),
          title: row[4]?.innerText.trim(),
          forecast: row[7]?.innerText.trim(),
          previous: row[8]?.innerText.trim(),
        };
      });
  });
  const news = parseTime(rows, week, 'energy');

  if (news.length) {
    Logger.debug(news[0]);
    await Mongo.collection('news').deleteMany({ week, type: 'energy' });
    await Mongo.collection('news').insertMany(news);
  }
  Logger.debug(`[${week}-week] Found ${news.length} energy news`);
  return news;
};

const getWeekNews = async (week: string, page: Page) => {
  await gotoAttempt(async () => {
    await page.goto('https://www.forexfactory.com/timezone', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('[name=timezone]', {
      visible: true,
    });
  });
  await page.select('[name=timezone]', 'Etc/UTC');
  await page.click('[value="Save Settings"]');
  await delay(10000);
  const forexNews = await getForexNews(week, page);

  await gotoAttempt(async () => {
    await page.goto('https://www.metalsmine.com/timezone', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('[name=timezone]', {
      visible: true,
    });
  });
  await page.select('[name=timezone]', 'Etc/UTC');
  await page.click('[value="Save Settings"]');
  await delay(10000);
  const metalNews = await getMetalNews(week, page);

  await gotoAttempt(async () => {
    await page.goto('https://www.energyexch.com/timezone', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('[name=timezone]', {
      visible: true,
    });
  });
  await page.select('[name=timezone]', 'Etc/UTC');
  await page.click('[value="Save Settings"]');
  await delay(10000);
  const energyNews = await getEnergyNews(week, page);

  return [...forexNews, ...metalNews, ...energyNews];
};

const getNextWeekNews = async () => {
  const browser = await newBrowser(
    env.nodeEnv !== 'development',
    env.pupProduct,
  );
  try {
    const page = await newPage(browser);
    const news: Record<string, any> = {};
    news.next = await getWeekNews('next', page);
  } finally {
    await browser.close();
  }
};

export default getNextWeekNews;
