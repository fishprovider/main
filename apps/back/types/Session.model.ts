import type { User } from '@fishbot/utils/types/User.model';
import type { Session as ExpressSession } from 'express-session';

interface UserSession {
  userInfo?: Partial<User>;
}

 type Session = ExpressSession & UserSession;

export type {
  Session,
  UserSession,
};
