# Intro
- This project is set up based on NPM Workspaces https://docs.npmjs.com/cli/v9/using-npm/workspaces
- All packages are under `packages` directory
- All apps are under `apps` directory

# How to dev?
- Option 1: run at root level
```
npm run dev -w apps/back
```
- Option 2: run at app level
```
cd apps/back
npm run dev
```
- Dev tools: recommend to run these before pushing code
```
npm run lint
npm run type-check
```

# How to deploy?
- WIP
