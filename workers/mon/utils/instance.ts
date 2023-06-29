const env = {
  typePre: process.env.TYPE_PRE,
};

const remoteInstances: Record<string, boolean> = {};

const setRemoteInstance = (typeId: string) => {
  remoteInstances[typeId] = true;
};

const sendRemoteInstance = async (typeId: string, command: string) => {
  const jobs = await Agenda.jobs({
    name: `${env.typePre}-${typeId}-remote`,
    'data.command': command,
  });
  if (jobs.length) {
    Logger.warn(`Command ${command} already sent to ${typeId}, ignoring...`);
    return false;
  }

  Agenda.now(`${env.typePre}-${typeId}-remote`, {
    command,
    reason: `Remote ${command}`,
  });
  return true;
};

export {
  remoteInstances,
  sendRemoteInstance,
  setRemoteInstance,
};
