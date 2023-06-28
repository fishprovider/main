import type { User } from '~types/User.model';

const getUserDefault: () => User = () => ({
  _id: 'testUserId',
  uid: 'testUserId',
  email: 'test@email.com',
  name: 'Test User',
  providerId: 'testProviderId',
  roles: {
    admin: false,
    adminWeb: false,
    managerWeb: false,

    adminProviders: {},
    traderProviders: {},
    protectorProviders: {},
    viewerProviders: {},
  },
});

const getUser = ({
  adminProvider,
}: {
  adminProvider?: string;
} = {}) => {
  const user = getUserDefault();

  if (adminProvider && user.roles?.adminProviders) {
    user.roles.adminProviders[adminProvider] = true;
  }

  return user;
};

export {
  getUser,
  getUserDefault,
};
