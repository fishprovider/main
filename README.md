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
- First of all, run `npm i` to install all dependencies

- Secondly, choose one of these options to run an app, e.g. `apps/back`

  - Option 1: run at root level
    ```shell
    npm run dev -w apps/back
    ```

  - Option 2: run at app level
    ```shell
    cd apps/back
    npm run dev
    ```

- Dev tools: recommend to run these before pushing any code
  ```shell
  npm run lint -ws
  npm run type-check -ws
  npm run build -ws
  ```

# How to run on cloud?
E.g. `apps/back`
```shell
npm run install-server
npm run install-trade-api
npm run install-trade
npm run install-pay
npm i -w apps/back
npm run build -w apps/back
npm start -w apps/back
```

E.g. `workers/gate`
```shell
npm run install-server
npm run install-trade
npm i -w workers/gate
npm run build -w workers/gate
npm start -w workers/gate
```

# How to deploy?
- Git push will trigger CI to deploy
