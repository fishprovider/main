//
// frontend
//

const frontendApps = [
  {
    name: 'web',
    env: {
      HUSKY: 0,
      DOPPLER_PROJECT: 'web',
      DOPPLER_CONFIG: 'prd',
      PORT: 3000,
    },
    script: 'npm',
    args: 'run start -w apps-frontend/web',
  },
  {
    name: 'web-secondary',
    env: {
      HUSKY: 0,
      DOPPLER_PROJECT: 'web',
      DOPPLER_CONFIG: 'prd',
      PORT: 3100,
    },
    script: 'npm',
    args: 'run start -w apps-frontend/web',
  },
];

//
// backend
//

const backendAppConfigBase = {
  script: 'npm',
  env: {
    HUSKY: 0,
    DOPPLER_PROJECT: 'backend',
    DOPPLER_CONFIG: 'prd_fish_server',
  },
};

const backendAppConfigs = [
  {
    ...backendAppConfigBase,
    name: 'back',
    cron_restart: '5 1 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 3001,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'back-secondary',
    project: 'back',
    cron_restart: '6 1 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 3101,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'bot',
    cron_restart: '15 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8007,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'copy',
    cron_restart: '20 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8006,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'cron',
    cron_restart: '5 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8002,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'gate',
    cron_restart: '0 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8001,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'head-ctrader',
    cron_restart: '25 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8005,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'head-meta',
    cron_restart: '30 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8009,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'mon',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8000,
      DRY_RUN: true,
    },
    cron_restart: '50 0 * * *',
  },
  {
    ...backendAppConfigBase,
    name: 'pay',
    cron_restart: '10 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8020,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'pup',
    cron_restart: '45 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8003,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'spot-ctrader',
    cron_restart: '35 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8004,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'spot-ctrader-poll',
    project: 'spot-ctrader',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8104,
      TYPE_ID: 'spot-ctrader-icmarkets-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD)$',
    },
    cron_restart: '55 0 * * *',
  },
  {
    ...backendAppConfigBase,
    name: 'spot-meta',
    cron_restart: '40 0 * * *',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8008,
    },
  },
  {
    ...backendAppConfigBase,
    name: 'spot-meta-poll',
    project: 'spot-meta',
    env: {
      ...backendAppConfigBase.env,
      PORT: 8108,
      TYPE_ID: 'spot-meta-exness-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD|BTCUSD|ETHUSD)$',
    },
    cron_restart: '0 1 * * *',
  },
];

const backendApps = backendAppConfigs.map((config) => {
  const {
    name,
    project = name,
    args = `run start -w apps-backend/${project}`,
  } = config;
  return {
    ...config,
    args,
  };
});

const apps = [...backendApps, ...frontendApps];

//
// deploy
//

const deployConfigBase = {
  user: 'marco',
  repo: 'git@gitlab.com:fishprovider/main.git',
  ref: 'origin/master',
  'post-deploy': 'git log -1 --pretty=format:"%h - %s"',
};

const deploy = {
  localhost: {
    ...deployConfigBase,
    host: 'localhost',
    path: '/Users/marco/pm2-apps/fishprovider',
  },
  fish: {
    ...deployConfigBase,
    host: '185.255.131.171',
    ssh_options: 'Port=1503',
    path: '/home/marco/work/pm2-apps/fishprovider',
  },
  fishSecondary: {
    ...deployConfigBase,
    host: '185.255.131.171',
    ssh_options: 'Port=1503',
    path: '/home/marco/work/pm2-apps/fishprovider-secondary',
    ref: 'tags/secondary',
    'pre-deploy': 'git tag -d -f secondary; git fetch --tags -f',
  },
};

module.exports = {
  apps,
  deploy,
};

// Examples:
// DEPLOY_ENV=fish npm run pm2-deploy-setup
// DEPLOY_ENV=fish npm run pm2-deploy
// DEPLOY_ENV=fish npm run pm2-deploy-ci
//
// DEPLOY_ENV=fish npm run pm2-deploy-build apps-backend/cron
// DEPLOY_ENV=fish npm run pm2-deploy-start cron
