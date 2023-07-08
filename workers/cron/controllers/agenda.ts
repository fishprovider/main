import { clean, getJobType } from '@fishprovider/core/libs/agenda';

import checkNews from '~services/news/checkNews';
import dailyBalance from '~services/stats/dailyBalance';
// import dailyFunding from '~services/stats/dailyFunding';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startCheckNews = async () => {
  const jobName = `${prefix}-check-news`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 15 },
    checkNews,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('15 minutes', jobName, getJobType('check-news'), { skipImmediate: true });
  }
};

const startDailyBalance = async () => {
  const jobName = `${prefix}-daily-balance`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 24 },
    dailyBalance,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('0 0 * * *', jobName, getJobType('daily-balance'), {
      timezone: 'GMT',
    });
  }
};

// const startDailyFunding = async () => {
//   const jobName = `${prefix}-daily-funding`;
//   Agenda.define(
//     jobName,
//     { lockLifetime: 1000 * 60 * 60 * 4 },
//     dailyFunding,
//   );

//   const jobs = await Agenda.jobs({
//     name: jobName,
//   });
//   if (!jobs.length) {
//     await Agenda.every('0 4 * * *', jobName, getJobType('daily-funding'));
//   }
// };

const start = async () => {
  await clean();
  await startCheckNews();
  await startDailyBalance();
  // await startDailyFunding();
};

export {
  start,
};
