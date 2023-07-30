const push = async (
  notification: { title: string, body: string },
  topic = 'allDevices',
) => {
  console.log('expoServer.push', notification, topic);
};

export { push };
