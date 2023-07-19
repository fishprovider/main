import type { UserSession } from '@fishprovider/enterprise-rules';
import type { Request, Response } from 'express';

type Handler = (params: {
  userSession: UserSession;
  payload: any;
}) => Promise<any>;

const getReqMsg = (req: Request) => [
  req.method,
  req.url,
  JSON.stringify(req.query),
  JSON.stringify(req.body),
  JSON.stringify(req.session),
].join(', ');

const wrapApiHandler = (handler: Handler) => async (req: Request, res: Response) => {
  try {
    let payload;
    switch (req.method) {
      case 'GET': {
        payload = req.query;
        break;
      }
      case 'POST': {
        payload = req.body;
        break;
      }
      default: {
        throw new Error(`Unsupported method ${req.method}`);
      }
    }

    const result = await handler({
      userSession: req.session.userInfo,
      payload,
    });
    res.status(200).json(result);
  } catch (err: any) {
    Logger.warn('ApiHandler failed', getReqMsg(req), err);
    res.status(403).send(err.message);
  }
};

export default wrapApiHandler;
