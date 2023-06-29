import { clean, getJobType } from '@fishbot/core/libs/agenda';

import { runPays } from '~services/pays';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startRunPays = async () => {
  const jobName = `${prefix}-pays`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 30 },
    () => runPays(),
  );
  Agenda.define(`${jobName}-manual`, () => runPays());

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('30 seconds', jobName, getJobType('pays'), { skipImmediate: true });
  }
};

const start = async () => {
  await clean();
  await startRunPays();
};

export {
  start,
};
