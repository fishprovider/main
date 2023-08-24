const envBackend = {
  HUSKY: 0,
  DOPPLER_PROJECT: 'backend',
  DOPPLER_CONFIG: 'prd',
};

const appConfigs = [
  {
    name: 'cron',
  },
  {
    name: 'bot',
  },
];

const apps = appConfigs.map(({
  workspace = 'workers',
  name,
  env,
}) => ({
  name,
  script: 'npm',
  args: `run start -w ${workspace}/${name}`,
  env: {
    ...envBackend,
    ...env,
  },
}));

const deploy = {
  localhost: {
    user: 'marco',
    host: ['localhost'],
    repo: 'git@gitlab.com:fishprovider/main.git',
    ref: 'origin/master',
    path: '/tmp/pm2-apps/fishprovider',
    'post-deploy': 'npm run pm2-post-deploy',
  },
};

module.exports = {
  apps,
  deploy,
};
