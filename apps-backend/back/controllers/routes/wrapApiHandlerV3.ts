import type { Request, Response } from 'express';

import { ApiHandler } from '~types/ApiHandler.model';

const getReqMsg = (req: Request) => [
  req.method,
  req.url,
  JSON.stringify(req.query),
  JSON.stringify(req.body),
  JSON.stringify(req.session),
].join(', ');

const wrapApiHandler = <T>(handler: ApiHandler<T>) => async (req: Request, res: Response) => {
  try {
    let data: any;
    switch (req.method) {
      case 'GET': {
        data = req.query;
        for (const prop in data) {
          if (data[prop] === 'true') {
            data[prop] = true;
          } else if (data[prop] === 'false') {
            data[prop] = false;
          }
        }
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

    const { result, userSessionNew } = await handler(
      data,
      req.session.userInfo,
    );

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
