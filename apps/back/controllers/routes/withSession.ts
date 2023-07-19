import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import type { Request, Response } from 'express';

type Handler = (params: {
  data: any;
  userInfo: User;
}) => Promise<{
  result?: any;
  error?: any;
}>;

const getReqMsg = (req: Request) => `${req.method} ${req.url}, ${JSON.stringify(req.query)}, ${JSON.stringify(req.body)}`;

const withSession = (handler: Handler) => async (req: Request, res: Response) => {
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
        throw new Error(ErrorType.badRequest);
      }
    }

    const { result, error } = await handler({
      data,
      userInfo: req.session.userInfo || {},
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
