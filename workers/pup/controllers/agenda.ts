import { clean, getJobType } from '@fishbot/core/libs/agenda';
import type { Job } from 'agenda';

import getNextWeekNews from '~services/getNextWeekNews';
import getStrategyInfos from '~services/getStrategyInfos';
import renewTokens from '~services/renewTokens';

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
    { lockLifetime: 1000 * 60 * 60 },
    getStrategyInfos,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('60 minutes', jobName, getJobType('get-strategy-info'), {
      skipImmediate: true,
    });
  }
};

const startRenewTokens = async () => {
  const jobName = `${prefix}-renew-tokens`;
  Agenda.define(jobName, async (job: Job) => {
    const { data } = job.attrs;
    if (data) {
      const { providerId } = data;
      Logger.warn(`📥 [${jobName}] Receive providerId ${providerId}`);
      await renewTokens(providerId);
    } else {
      Logger.error(`🔥 [${jobName}] Missing data ${job.attrs}`);
    }
  });
};

const start = async () => {
  await clean();
  await startGetNextWeekNews();
  await startGetStrategyInfo();
  await startRenewTokens();
};

export {
  start,
};
