/* eslint-disable no-param-reassign */
import { ErrorType } from '@fishprovider/utils/constants/error';
import { getRoleProvider } from '@fishprovider/utils/helpers/user';
import type { User } from '@fishprovider/utils/types/User.model';
import type {
  NextFunction, Request, Response, Router,
} from 'express';
import type { Store } from 'express-session';
import moment from 'moment';

import type { Session } from '~types/Session.model';

const destroySession = (session: Session) => new Promise((resolve, reject) => {
  session.destroy((err: any) => {
    if (err) reject(err);
    else resolve(true);
  });
});

const setSession = (session: Session, key: keyof Session, val: any) => new Promise(
  (resolve, reject) => {
    session[key] = val;
    session.save((err: any) => {
      if (err) reject(err);
      else resolve(true);
    });
  },
);

const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await setSession(req.session, 'userInfo', {});
    await destroySession(req.session);

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new Error(ErrorType.badRequest);
    }

    const {
      // iat,
      uid, email, name, picture,
    } = await Firebase.auth().verifyIdToken(token);
      // if (new Date().getTime() / 1000 - iat > 5 * 60) { // 5 minutes
      //   throw new Error(ErrorType.tokenExpired);
      // }
    if (!email) {
      throw new Error(ErrorType.badRequest);
    }

    const doc = await Mongo.collection<User>('users').findOne({ _id: uid }, {
      projection: {
        roles: 1,
        starProviders: 1,
      },
    });
    const userInfo = {
      ...doc,
      _id: uid,
      uid,
      email,
      name,
      picture,
    };
    if (!doc) {
      userInfo.createdAt = new Date();
      Mongo.collection<User>('users').insertOne(userInfo).then(() => {
        Logger.warn(`📥 New user login ${email}, ${uid}`);
      });
    } else if (moment().diff(doc.updatedAt, 'days') > 7) {
      Logger.warn(`📥 Returned user login ${email} since ${moment(doc.updatedAt)}`);
    }
    Logger.debug('[auth] login userInfo', userInfo);

    await setSession(req.session, 'userInfo', userInfo);

    res.status(200).json(userInfo);
  } catch (err) {
    Logger.warn('[auth] login failed', err);
    next(err);
  }
};

const clearHandler = (sessionStore: Store) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isAdmin } = getRoleProvider(req.session.userInfo?.roles);
    if (!isAdmin) {
      throw new Error(ErrorType.accessDenied);
    }

    Logger.warn('🔥🔥🔥 Clearing all sessions 🔥🔥🔥');
    await new Promise((resolve, reject) => {
      if (sessionStore.clear) {
        sessionStore.clear((err: any) => {
          if (err) reject(err);
          else resolve(true);
        });
      }
    });
    Logger.warn('🔥🔥🔥 Cleared all sessions 🔥🔥🔥');

    res.status(200).end();
  } catch (err) {
    next(err);
  }
};

const setAuthHandlers = (router: Router, sessionStore: Store) => {
  router.post('/auth/logout', logoutHandler);
  router.post('/auth/login', loginHandler);
  router.post('/auth/clear', clearHandler(sessionStore));
};

export default setAuthHandlers;
