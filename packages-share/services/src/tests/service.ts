import { ServiceContext, UserSession } from '@fishprovider-new/core';

export const userSessionDefault: UserSession = {
  _id: 'testId',
  email: 'testEmail',
  name: 'testName',
};

export const serviceContextDefault: ServiceContext = {
  userSession: userSessionDefault,
};
