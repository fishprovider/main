import type { Router } from 'express';
import { globSync } from 'glob';
import path from 'path';

import wrapApiHandler from './wrapApiHandlerV3';

const apiDir = `${process.cwd()}/dist/apiV3`;

const getHandler = async (route: string) => {
  const mod = await import(`${apiDir}${route}.js`);
  return mod.default;
};

const getRoutes = (routeFiles: string[]) => {
  const routeTrimCount = apiDir.length + 1;
  return routeFiles.map((routeFile) => {
    const { dir, name } = path.parse(routeFile); // ex: /root/dist/api/accounts/add.js
    const routeDir = dir.substring(routeTrimCount); // ex: accounts
    return path.join('/', routeDir, name); // ex: /accounts/add
  });
};

const buildApiRoutes = (router: Router) => {
  const routeFiles = globSync(`${apiDir}/**/*.js`, { ignore: '**/*.test.*' });
  Logger.debug(`[route] Found ${routeFiles.length} route files`, routeFiles);

  const routes = getRoutes(routeFiles);
  Logger.debug(`[route] Parsed ${routes.length} routes`, routes);

  return Promise.all(
    routes.map(async (routeRaw) => {
      const handler = await getHandler(routeRaw);
      const route = path.join('/v3', routeRaw);
      if (route.includes('/get')) {
        Logger.debug('GET', route);
        router.get(route, wrapApiHandler(handler));
      } else {
        Logger.debug('POST', route);
        router.post(route, wrapApiHandler(handler));
      }
    }),
  );
};

export default buildApiRoutes;
