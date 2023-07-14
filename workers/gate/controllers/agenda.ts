import { clean, getJobType } from '@fishprovider/core/dist/libs/agenda';

import { checkLastUpdated } from '~services/checkCTrader';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startCheckCTrader = async () => {
  const jobName = `${prefix}-check-ctrader`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 5 },
    checkLastUpdated,
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('5 minutes', jobName, getJobType('check-ctrader'), {
      skipImmediate: true,
    });
  }
};

const start = async () => {
  await clean();
  await startCheckCTrader();
};

export {
  start,
};
