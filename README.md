# Rules for the best performance

- In each local `package.json` of sub-projects, only include `dependencies` and `devDependencies` that required
for `build` and `start`, not for `dev`. If `dev` needs some `devDependencies`, put it in the root `package.json`

- With the rule above, the `build` and `start` on the cloud will have the optional speed to run

# How to dev?
- Install Doppler for env secrets https://docs.doppler.com/docs/install-cli
  ```shell
  doppler login
  doppler setup -p backend -c prd_demo_local
  ```

- Install dependencies
  ```shell
  # Case 1: for all projects
  npm i

  # Case 2: for one project
  npm i -w apps-backend/back
  ```

- Start dev server
  ```shell
  # Option 1: run at root level
  npm run prebuild -w apps-backend/back
  npm run dev -w apps-backend/back

  # Option 2: run at project level
  cd apps-backend/back
  npm run prebuild
  npm run dev
  ```

- Run dev tools (recommended before pushing any code)
  ```shell
  npm run doctor
  ```

# How to run on prod?
- Note that we don't want to install all dependencies on prod, only install what we need

- Option 1: run at root level
  ```shell
  npm i -w apps-backend/back
  npm run build -w apps-backend/back
  npm start -w apps-backend/back
  ```

- Option 2: run at project level
  ```shell
  cd apps-backend/back
  npm i
  npm run build
  npm start
  ```

# How to deploy?
- Git push will trigger CI to deploy, see `ci/deploy.yml`
- For `apps-frontend/web`, use script `deploy-dev.sh`, `deploy-canary.sh`, `deploy-prod.sh`
