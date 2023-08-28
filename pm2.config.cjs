const envBackend = {
  HUSKY: 0,
  DOPPLER_PROJECT: 'backend',
  DOPPLER_CONFIG: 'prd',
};

const appConfigs = [
  { name: 'gate' },
  { name: 'cron' },
  { name: 'mon' },
  { name: 'pay' },
  { name: 'bot' },
  { name: 'copy' },
  { name: 'head-ctrader' },
  { name: 'head-meta' },
  { name: 'spot-ctrader' },
  { name: 'spot-meta' },
  { name: 'pup' },
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
    path: '/tmp/pm2-apps/fishprovider',
    'post-deploy': 'git rev-parse HEAD',
  },
};

module.exports = {
  apps,
  deploy,
};
