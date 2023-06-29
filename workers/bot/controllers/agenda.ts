import { clean, getJobType } from '@fishbot/core/libs/agenda';

import { runBots } from '~services/provider';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startRunBots = async () => {
  const jobName = `${prefix}-bots`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 30 },
    () => runBots(),
  );
  Agenda.define(`${jobName}-manual`, () => runBots());

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('30 seconds', jobName, getJobType('bots'), { skipImmediate: true });
  }
};

const start = async () => {
  await clean();
  await startRunBots();
};

export {
  start,
};
