import type { Moment } from 'moment';

interface LastRun {
  at: Moment;
  checkIds: string[];
}

export type { LastRun };
