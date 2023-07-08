import { clean, getJobType } from '@fishprovider/core/libs/agenda';

import { runCopiers } from '~services/provider';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
};

const prefix = `${env.typePre}-${env.typeId}`;

const startRunCopiers = async () => {
  const jobName = `${prefix}-copiers`;
  Agenda.define(
    jobName,
    { lockLifetime: 1000 * 30 },
    () => runCopiers(),
  );
  Agenda.define(`${jobName}-manual`, () => runCopiers());

  const jobs = await Agenda.jobs({
    name: jobName,
  });
  if (!jobs.length) {
    await Agenda.every('30 seconds', jobName, getJobType('copiers'), { skipImmediate: true });
  }
};

const start = async () => {
  await clean();
  await startRunCopiers();
};

export {
  start,
};
