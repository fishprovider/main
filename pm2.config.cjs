const envBackend = {
  HUSKY: 0,
  DOPPLER_PROJECT: 'backend',
  DOPPLER_CONFIG: 'prd_fish_server',
};

const appConfigs = [
  {
    workspace: 'apps',
    name: 'web',
    env: {
      PORT: 3000,
    },
  },
  {
    workspace: 'apps',
    name: 'back',
    cron_restart: '5 1 * * *',
    env: {
      PORT: 3001,
    },
  },
  {
    name: 'bot',
    cron_restart: '15 0 * * *',
    env: {
      PORT: 8007,
    },
  },
  {
    name: 'copy',
    cron_restart: '20 0 * * *',
    env: {
      PORT: 8006,
    },
  },
  {
    name: 'cron',
    cron_restart: '5 0 * * *',
    env: {
      PORT: 8002,
    },
  },
  {
    name: 'gate',
    cron_restart: '0 0 * * *',
    env: {
      PORT: 8001,
    },
  },
  {
    name: 'head-ctrader',
    cron_restart: '25 0 * * *',
    env: {
      PORT: 8005,
    },
  },
  {
    name: 'head-meta',
    cron_restart: '30 0 * * *',
    env: {
      PORT: 8009,
    },
  },
  {
    name: 'mon',
    env: {
      PORT: 8000,
      DRY_RUN: true,
    },
    cron_restart: '50 0 * * *',
  },
  {
    name: 'pay',
    cron_restart: '10 0 * * *',
    env: {
      PORT: 8020,
    },
  },
  {
    name: 'pup',
    cron_restart: '45 0 * * *',
    env: {
      PORT: 8003,
    },
  },
  {
    name: 'spot-ctrader',
    cron_restart: '35 0 * * *',
    env: {
      PORT: 8004,
    },
  },
  {
    name: 'spot-ctrader-poll',
    project: 'spot-ctrader',
    env: {
      PORT: 8104,
      TYPE_ID: 'spot-ctrader-icmarkets-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD)$',
    },
    cron_restart: '55 0 * * *',
  },
  {
    name: 'spot-meta',
    cron_restart: '40 0 * * *',
    env: {
      PORT: 8008,
    },
  },
  {
    name: 'spot-meta-poll',
    project: 'spot-meta',
    env: {
      PORT: 8108,
      TYPE_ID: 'spot-meta-exness-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD|BTCUSD|ETHUSD)$',
    },
    cron_restart: '0 1 * * *',
  },
];

const apps = appConfigs.map(({
  workspace = 'workers',
  name,
  project,
  env,
  cron_restart,
}) => ({
  name,
  env: {
    ...envBackend,
    ...env,
  },
  cron_restart,
  script: 'npm',
  args: `run start -w ${workspace}/${project || name}`,
}));

const deployConfig = {
  repo: 'git@gitlab.com:fishprovider/main.git',
  ref: 'origin/master',
  'post-deploy': 'git rev-parse HEAD',
};

const deploy = {
  localhost: {
    ...deployConfig,
    user: 'marco',
    host: 'localhost',
    path: '/Users/marco/pm2-apps/fishprovider',
  },
  fish: {
    ...deployConfig,
    user: 'marco',
    host: '185.255.131.171',
    ssh_options: 'Port=1503',
    path: '/home/marco/work/pm2-apps/fishprovider',
  },
};

module.exports = {
  apps,
  deploy,
};
