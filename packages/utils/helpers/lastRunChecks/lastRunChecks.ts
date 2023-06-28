import _ from 'lodash';
import moment from 'moment';

import type { LastRun } from '~types/LastRun.model';

const isRunExpired = ({
  run, timeUnit, timeAmt, checkIds,
}: {
  run?: LastRun,
  timeUnit: moment.unitOfTime.Diff,
  timeAmt: number,
  checkIds: string[],
}) => {
  if (!run) return true;
  if (moment().diff(run.at, timeUnit) > timeAmt) return true;
  if (checkIds.length !== run.checkIds.length || _.difference(checkIds, run.checkIds).length) {
    return true;
  }
  return false;
};

const isLastRunExpired = ({
  runs, runId, timeUnit, timeAmt, checkIds,
}: {
  runs: Record<string, LastRun>,
  runId: string,
  timeUnit: moment.unitOfTime.Diff,
  timeAmt: number,
  checkIds: string[],
}) => {
  if (isRunExpired({
    run: runs[runId],
    timeUnit,
    timeAmt,
    checkIds,
  })) {
    // eslint-disable-next-line no-param-reassign
    runs[runId] = { at: moment(), checkIds };
    return true;
  }
  return false;
};

export { isLastRunExpired };
