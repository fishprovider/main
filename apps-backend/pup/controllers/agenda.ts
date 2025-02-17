import { clean, getJobType } from '@fishprovider/old-core/dist/libs/agenda';

import getNextWeekNews from '~services/getNextWeekNews';
import getStrategyInfos from '~services/getStrategyInfos';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startGetNextWeekNews = async () => {
  const jobName = `${prefix}-next-news`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 24 * 3 },
    getNextWeekNews,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('3 days', jobName, getJobType('next-news'), { skipImmediate: true });
  }
};

const startGetStrategyInfo = async () => {
  const jobName = `${prefix}-get-strategy-info`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 4 },
    getStrategyInfos,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('240 minutes', jobName, getJobType('get-strategy-info'), {
      skipImmediate: true,
    });
  }
};

const start = async () => {
  await clean();
  await startGetNextWeekNews();
  await startGetStrategyInfo();
};

export {
  start,
};
