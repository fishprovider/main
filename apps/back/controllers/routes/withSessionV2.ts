import type { UserSession } from '@fishprovider/enterprise-rules';
import type { Request, Response } from 'express';

type Handler = (params: {
  userSession: UserSession;
  payload: any;
}) => Promise<{
  result?: any;
  error?: any;
}>;

const getReqMsg = (req: Request) => `${req.method} ${req.url}, ${JSON.stringify(req.query)}, ${JSON.stringify(req.body)}`;

const withSession = (handler: Handler) => async (req: Request, res: Response) => {
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

    const { result, error } = await handler({
      userSession: req.session.userInfo,
      payload,
    });

    if (error) {
      Logger.warn(`Handler Error: ${getReqMsg(req)}`, error);
      Logger.debug(`Handler Error: ${getReqMsg(req)}`, req.session, req.cookies);
      res.status(403).send(error);
    } else {
      res.status(200).json(result);
    }
  } catch (err: any) {
    Logger.warn(`Server Error: ${getReqMsg(req)}`, err.response?.data, err);
    res.status(403).send(err.message);
  }
};

export default withSession;
