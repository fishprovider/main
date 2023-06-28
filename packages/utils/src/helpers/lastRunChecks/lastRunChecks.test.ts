import moment from 'moment';

import delay from '~/helpers/delay';

import { isLastRunExpired } from './lastRunChecks';

test('lastRunChecks', async () => {
  const runs = {
    run1: { at: moment(), checkIds: ['check1', 'check2'] },
    run2: { at: moment(), checkIds: ['check3', 'check4'] },
  };

  const isNotExpired = isLastRunExpired({
    runs,
    runId: 'run1',
    timeUnit: 'seconds',
    timeAmt: 1,
    checkIds: ['check1', 'check2'],
  });
  expect(isNotExpired).toBe(false);

  await delay(2000);

  const isExpired = isLastRunExpired({
    runs,
    runId: 'run1',
    timeUnit: 'seconds',
    timeAmt: 1,
    checkIds: ['check1', 'check2'],
  });
  expect(isExpired).toBe(true);
});
