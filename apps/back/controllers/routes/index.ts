import { Router } from 'express';
import type { Store } from 'express-session';

import buildApiRoutes from './buildApiRoutes';
import buildApiRoutesV3 from './buildApiRoutesV3';
import setAuthRoutes from './setAuthRoutes';

const routes = async (sessionStore: Store) => {
  const router = Router();
  setAuthRoutes(router, sessionStore);
  await buildApiRoutes(router);
  await buildApiRoutesV3(router);
  return router;
};

export default routes;
