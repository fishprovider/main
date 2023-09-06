const envBackend = {
  HUSKY: 0,
  DOPPLER_PROJECT: 'backend',
  DOPPLER_CONFIG: 'prd_fish_server',
};

const appConfigs = [
  { name: 'gate' },
  { name: 'cron' },
  { name: 'pay' },
  { name: 'bot' },
  { name: 'copy' },
  { name: 'head-ctrader' },
  { name: 'head-meta' },
  { name: 'spot-ctrader' },
  { name: 'spot-meta' },
  { name: 'pup' },
  {
    name: 'mon',
    env: {
      DRY_RUN: true,
    },
  },
  {
    name: 'spot-ctrader-poll',
    env: {
      TYPE_ID: 'spot-ctrader-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD)$',
    },
  },
  {
    name: 'spot-meta-poll',
    env: {
      TYPE_ID: 'spot-meta-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD|BTCUSD|ETHUSD)$',
    },
  },
];

const apps = appConfigs.map(({
  workspace = 'workers',
  name,
  env,
}) => ({
  name,
  env: {
    ...envBackend,
    ...env,
  },
  script: 'npm',
  args: `run start -w ${workspace}/${name}`,
  cron_restart: '0 0 * * *',
}));

const deployConfig = {
  repo: 'git@gitlab.com:fishprovider/main.git',
  ref: 'origin/master',
};

const deploy = {
  localhost: {
    ...deployConfig,
    user: 'marco',
    host: 'localhost',
    path: '/Users/marco/pm2-apps/fishprovider',
    'post-deploy': 'git rev-parse HEAD',
  },
  fish: {
    ...deployConfig,
    user: 'marco',
    host: '185.255.131.171',
    path: '/home/marco/work/pm2-apps/fishprovider',
    'post-deploy': 'git rev-parse HEAD',
  },
};

module.exports = {
  apps,
  deploy,
};
