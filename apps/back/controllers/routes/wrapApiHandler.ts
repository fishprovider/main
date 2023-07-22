import type { ApiHandler } from '@fishprovider/adapter-backend';
import type { Request, Response } from 'express';

const getReqMsg = (req: Request) => [
  req.method,
  req.url,
  JSON.stringify(req.query),
  JSON.stringify(req.body),
  JSON.stringify(req.session),
].join(', ');

const wrapApiHandler = <T>(handler: ApiHandler<T>) => async (req: Request, res: Response) => {
  try {
    let data;
    switch (req.method) {
      case 'GET': {
        data = req.query;
        break;
      }
      case 'POST': {
        data = req.body;
        break;
      }
      default: {
        throw new Error(`Unsupported method ${req.method}`);
      }
    }

    const { result, userSessionNew } = await handler({
      userSession: req.session.userInfo,
      data,
    });

    if (userSessionNew) {
      req.session.userInfo = {
        ...req.session.userInfo,
        ...userSessionNew,
      };
    }

    res.status(200).json(result);
  } catch (err: any) {
    Logger.warn('ApiHandler failed', getReqMsg(req), err);
    res.status(403).send(err.message);
  }
};

export default wrapApiHandler;
