import { clean, getJobType } from '@fishprovider/core/dist/libs/agenda';

import { checkLastUpdated } from '~services/checkMetaTrader';
import { pollSymbols, renewSymbols } from '~services/provider';
import { spotTasks } from '~utils/tasks';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startCheckMetaTrader = async () => {
  const jobName = `${prefix}-check-metatrader`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 5 },
    () => checkLastUpdated(),
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('5 minutes', jobName, getJobType('check-metatrader'), {
      skipImmediate: true,
    });
  }
};

const startPollSymbols = async () => {
  const jobName = `${prefix}-poll-symbols`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 30 },
    () => pollSymbols(),
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('30 seconds', jobName, getJobType('poll-symbols'), {
      skipImmediate: true,
    });
  }
};

const startPollAllSymbols = async () => {
  const jobName = `${prefix}-poll-all-symbols`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 2 },
    () => pollSymbols(),
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('2 minutes', jobName, getJobType('poll-all-symbols'), {
      skipImmediate: true,
    });
  }
};

const startRenewSymbols = async () => {
  const jobName = `${prefix}-renew-symbols`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 24 * 7 },
    () => renewSymbols(),
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    // 13:00 Sat UTC+0
    await Agenda.every('0 13 * * 6', jobName, getJobType('renew-symbols'), {
      skipImmediate: true,
    });
  }
};

const start = async () => {
  await clean();
  await startCheckMetaTrader();
  await startRenewSymbols();
  if (spotTasks.poll) {
    await startPollSymbols();
    await startPollAllSymbols();
  }
};

export {
  start,
};
