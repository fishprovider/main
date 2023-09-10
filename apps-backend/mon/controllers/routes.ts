import type { Request, Response } from 'express';
import { Router } from 'express';

import remoteCommand from '~services/remoteCommand';

type Handler = (_: any) => Promise<{ result?: any; error?: any; }>;

const routeHandler = (handler: Handler) => async (req: Request, res: Response) => {
  try {
    const { result, error } = await handler(req.body);
    if (error) {
      res.status(403).send(error);
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    Logger.error(err);
    res.status(403).send(err);
  }
};

const routes = () => {
  const router = Router();

  router.post('/remoteCommand', routeHandler(remoteCommand));

  return router;
};

export default routes;
