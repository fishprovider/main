import { getProvider } from '@fishbot/swap/utils/account';

const env = {
  copyTasks: process.env.COPY_TASKS || 'removeClosedOrders,copyNewOrders,updateSLTP,checkEquitySL',
};

const copyTasks: Record<string, boolean> = {};
env.copyTasks.split(',').forEach((task) => {
  copyTasks[task] = true;
});

const getAccount = async (providerId: string) => {
  const account = await getProvider(providerId);
  if (!account) {
    Logger.warn(`Account not found ${providerId}`);
  }
  return account;
};

export {
  copyTasks,
  getAccount,
};
