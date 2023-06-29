import { clean, getJobType } from '@fishbot/core/libs/agenda';

import { checkLastUpdated } from '~services/checkCTrader';
import { renewSymbols, renewTokens } from '~services/provider';

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
    () => checkLastUpdated(),
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

const startRenewTokens = async () => {
  const jobName = `${prefix}-renew-tokens`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 60 * 60 * 24 * 7 },
    () => renewTokens(),
  );

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    // 10:00 Sat UTC+0
    await Agenda.every('0 10 * * 6', jobName, getJobType('renew-tokens'), {
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
  await startCheckCTrader();
  await startRenewTokens();
  await startRenewSymbols();
};

export {
  start,
};
