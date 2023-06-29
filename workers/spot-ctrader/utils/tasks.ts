const env = {
  spotTasks: process.env.SPOT_TASKS || 'price', // price,bar,depth
  barPeriods: process.env.BAR_PERIODS || 'M5,M15,H1,H4,D1,W1,MN1',
};

const spotTasks: Record<string, boolean> = {};
env.spotTasks.split(',').forEach((task) => {
  spotTasks[task] = true;
});

const periods = env.barPeriods.split(',');

export {
  periods,
  spotTasks,
};
