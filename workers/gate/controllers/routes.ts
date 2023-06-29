import type { Request, Response } from 'express';
import { Router } from 'express';

import barSet from '~services/barSet';
import priceSet from '~services/priceSet';
import signalSet from '~services/signalSet';
import srGet from '~services/srGet';

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

  router.post('/priceSet', routeHandler(priceSet));
  router.post('/barSet', routeHandler(barSet));
  router.post('/signalSet', routeHandler(signalSet));
  router.post('/srGet', routeHandler(srGet));

  return router;
};

export default routes;
