import { ServiceContext, UserSession } from '..';

export const userSessionDefault: UserSession = {
  _id: 'testId',
  email: 'testEmail',
  name: 'testName',
};

export const serviceContextDefault: ServiceContext = {
  userSession: userSessionDefault,
};
