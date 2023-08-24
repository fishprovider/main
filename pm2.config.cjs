const envBackend = {
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

module.exports = {
  apps,
};
