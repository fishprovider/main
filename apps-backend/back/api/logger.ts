// public
const logger = async ({ data }: {
  data: {
    methodName: 'error' | 'warn' | 'info' | 'debug',
    messages: any[]
  }
}) => {
  const { methodName, messages } = data;
  Logger[methodName](...messages);
  return {};
};

export default logger;
