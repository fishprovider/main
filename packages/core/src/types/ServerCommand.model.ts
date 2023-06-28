import type { JobAttributesData } from 'agenda';

import type ServerCommands from '~constants/serverCommands';

interface ServerCommand extends JobAttributesData {
  command?: ServerCommands;
}

export type { ServerCommand };
