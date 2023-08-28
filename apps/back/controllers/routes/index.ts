import { Router } from 'express';
import type { Store } from 'express-session';

import buildApiRoutes from './buildApiRoutes';
import buildApiRoutesV2 from './buildApiRoutesV2';
import buildApiRoutesV3 from './buildApiRoutesV3';
import setAuthRoutes from './setAuthRoutes';

const routes = async (sessionStore: Store) => {
  const router = Router();
  setAuthRoutes(router, sessionStore);
  await buildApiRoutes(router);
  await buildApiRoutesV2(router);
  await buildApiRoutesV3(router);
  return router;
};

export default routes;
