import ServerCommands from '~constants/serverCommands';
import {
  destroy, restart, resume, status, stop,
} from '~controllers/app';
import type { ServerCommand } from '~types/ServerCommand.model';

const serverCommandHandlers = async (data: ServerCommand) => {
  switch (data.command) {
    case ServerCommands.status:
      await status();
      break;
    case ServerCommands.stop:
      await stop();
      break;
    case ServerCommands.resume:
      await resume();
      break;
    case ServerCommands.restart:
      await restart();
      break;
    case ServerCommands.restartProcess:
      await restart({ restartProcess: true });
      break;
    case ServerCommands.destroy:
      await destroy();
      break;
    case ServerCommands.kill:
      process.exit();
      // eslint-disable-next-line no-fallthrough
    default:
      Logger.error(`🔥 Unknown command ${data.command}`);
  }
};

export default serverCommandHandlers;
