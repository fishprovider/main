import { sendRemoteInstance } from '~utils/instance';

const env = {
  typeId: process.env.TYPE_ID,
  typePre: process.env.TYPE_PRE,
  apiPass: process.env.API_PASS,
};

const remoteCommand = async (data: any) => {
  const { secret, instance, command } = data;
  if (secret !== env.apiPass) {
    return { error: 'Params error' };
  }

  Logger.warn(`Sending remoteCommand ${instance}: ${command}`);
  sendRemoteInstance(instance, command);

  return { result: 'Done' };
};

export default remoteCommand;
