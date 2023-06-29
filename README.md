# Intro

- This project is set up based on NPM Workspaces https://docs.npmjs.com/cli/v9/using-npm/workspaces

- All packages are under `packages` directory

- All workers are under `workers` directory

- All apps are under `apps` directory

  ```json
  "workspaces": [
    "packages/*",
    "workers/*",
    "apps/*"
  ]
  ```

# How to dev?

- First of all, install dependencies
  ```shell
  npm i
  ```

- Secondly, start dev server, e.g. `apps/back`
  ```shell
  npm run dev -w apps/back
  ```

- (Optional) Run dev tools before pushing any code
  ```shell
  npm run doctor
  ```

# How to run on prod?

Note that we don't want to install all dependencies on prod, only install what we need

E.g. `apps/back`
```shell
npm i -w apps/back
npm run build -w apps/back
npm start -w apps/back
```

E.g. `workers/cron`
```shell
npm i -w workers/cron
npm run build -w workers/cron
npm start -w workers/cron
```

# How to deploy?
- Git push will trigger CI to deploy
