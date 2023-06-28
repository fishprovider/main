import { Router } from 'express';
import type { Store } from 'express-session';

import buildApiRoutes from './buildApiRoutes';
import setAuthRoutes from './setAuthRoutes';

const routes = async (sessionStore: Store) => {
  const router = Router();
  setAuthRoutes(router, sessionStore);
  await buildApiRoutes(router);
  return router;
};

export default routes;
