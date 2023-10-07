//
// frontend
//

const frontendAppBase = {
  script: 'npm',
  exp_backoff_restart_delay: 100,
  env: {
    HUSKY: 0,
    DOPPLER_PROJECT: 'web',
    DOPPLER_CONFIG: 'prd',
  },
};

const frontendApps = [
  {
    ...frontendAppBase,
    name: 'web',
    args: 'run start -w apps-frontend/web',
    env: {
      ...frontendAppBase.env,
      PORT: 3000,
    },
  },
  {
    ...frontendAppBase,
    name: 'web-secondary',
    args: 'run start -w apps-frontend/web',
    env: {
      ...frontendAppBase.env,
      PORT: 3100,
    },
  },
];

//
// backend
//

const backendAppBase = {
  script: 'npm',
  exp_backoff_restart_delay: 100,
  env: {
    HUSKY: 0,
    DOPPLER_PROJECT: 'backend',
    DOPPLER_CONFIG: 'prd_fish_server',
    PORT: 0, // system will assign a random port
  },
};

const backendApps = [
  {
    ...backendAppBase,
    name: 'back',
    args: 'run start -w apps-backend/back',
    cron_restart: '0 */4 * * *',
    env: {
      ...backendAppBase.env,
      PORT: 3001,
    },
  },
  {
    ...backendAppBase,
    name: 'back-secondary',
    args: 'run start -w apps-backend/back',
    cron_restart: '2 */4 * * *',
    env: {
      ...backendAppBase.env,
      PORT: 3101,
    },
  },
  {
    ...backendAppBase,
    name: 'bot',
    args: 'run start -w apps-backend/bot',
    cron_restart: '4 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'copy',
    args: 'run start -w apps-backend/copy',
    cron_restart: '6 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'cron',
    args: 'run start -w apps-backend/cron',
    cron_restart: '8 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'gate',
    args: 'run start -w apps-backend/gate',
    cron_restart: '10 */4 * * *',
    env: {
      ...backendAppBase.env,
      PORT: 8001,
    },
  },
  {
    ...backendAppBase,
    name: 'head-ctrader',
    args: 'run start -w apps-backend/head-ctrader',
    cron_restart: '12 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'head-meta',
    args: 'run start -w apps-backend/head-meta',
    cron_restart: '14 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'mon',
    args: 'run start -w apps-backend/mon',
    cron_restart: '16 */4 * * *',
    env: {
      ...backendAppBase.env,
      PORT: 8000,
      DRY_RUN: true,
    },
  },
  {
    ...backendAppBase,
    name: 'pay',
    args: 'run start -w apps-backend/pay',
    cron_restart: '18 */4 * * *',
    env: {
      ...backendAppBase.env,
      PORT: 8020,
    },
  },
  {
    ...backendAppBase,
    name: 'pup',
    args: 'run start -w apps-backend/pup',
    cron_restart: '20 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'spot-ctrader',
    args: 'run start -w apps-backend/spot-ctrader',
    cron_restart: '22 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'spot-meta',
    args: 'run start -w apps-backend/spot-meta',
    cron_restart: '24 */4 * * *',
  },
  {
    ...backendAppBase,
    name: 'spot-ctrader-poll',
    args: 'run start -w apps-backend/spot-ctrader',
    cron_restart: '26 */4 * * *',
    env: {
      ...backendAppBase.env,
      TYPE_ID: 'spot-ctrader-icmarkets-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD)$',
    },
  },
  {
    ...backendAppBase,
    name: 'spot-meta-poll',
    args: 'run start -w apps-backend/spot-meta',
    cron_restart: '28 */4 * * *',
    env: {
      ...backendAppBase.env,
      TYPE_ID: 'spot-meta-exness-poll',
      SPOT_TASKS: 'poll',
      WATCH_PATTERN: '^(AUDCAD|AUDCHF|AUDJPY|AUDNZD|AUDUSD|CADCHF|CADJPY|CHFJPY|EURAUD|EURCAD|EURCHF|EURGBP|EURJPY|EURNZD|EURUSD|GBPAUD|GBPCAD|GBPCHF|GBPJPY|GBPNZD|GBPUSD|NZDCAD|NZDCHF|NZDJPY|NZDUSD|USDCAD|USDCHF|USDJPY|XAGUSD|XAUUSD|BTCUSD|ETHUSD)$',
    },
  },
];

const apps = [...backendApps, ...frontendApps];

//
// deploy
//

const deployConfigBase = {
  user: 'marco',
  repo: 'git@gitlab.com:fishprovider/main.git',
  ref: 'origin/master',
  'post-deploy': 'git rev-parse HEAD',
};

const deployConfigFishServer = {
  ...deployConfigBase,
  host: 'fish-server.fishprovider.com',
  ssh_options: 'Port=1503',
};

const deploy = {
  localhost: {
    ...deployConfigBase,
    host: 'localhost',
    path: '/Users/marco/pm2-apps/fishprovider',
  },
  fishWeb: { // web
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-web',
  },
  fishBack: { // back
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-back',
  },
  fishPrice: { // spot-*
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-price',
  },
  fishOrder: { // head-*
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-order',
  },
  fishBot: { // bot, copy
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-bot',
  },
  fishPay: { // pay
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-pay',
  },
  fishCron: { // cron, mon, gate
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-cron',
  },
  fishSecondary: { // web-secondary, back-secondary
    ...deployConfigFishServer,
    path: '/home/marco/work/pm2-apps/fishprovider-secondary',
    ref: 'tags/secondary',
    'pre-deploy': 'git tag -d secondary; git fetch --tags -f',
  },
};

module.exports = {
  apps,
  deploy,
};

/* Examples:

./deploy.sh web frontend fishWeb
./deploy.sh back backend fishBack

./deploy.sh spot-ctrader backend fishPrice
./deploy.sh spot-meta backend fishPrice
./deploy.sh spot-ctrader-poll backend fishPrice
./deploy.sh spot-meta-poll backend fishPrice

./deploy.sh head-ctrader backend fishOrder
./deploy.sh head-meta backend fishOrder

./deploy.sh bot backend fishBot
./deploy.sh copy backend fishBot

./deploy.sh pay backend fishPay

./deploy.sh cron backend fishCron
./deploy.sh gate backend fishCron
./deploy.sh mon backend fishCron

./deploy-secondary.sh web frontend
./deploy-secondary.sh back backend

*/
