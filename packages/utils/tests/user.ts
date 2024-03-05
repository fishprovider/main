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

    adminAccounts: {},
    traderAccounts: {},
    protectorAccounts: {},
    viewerAccounts: {},
  },
});

const getUser = ({
  adminProvider,
}: {
  adminProvider?: string;
} = {}) => {
  const user = getUserDefault();

  if (adminProvider && user.roles?.adminAccounts) {
    user.roles.adminAccounts[adminProvider] = true;
  }

  return user;
};

export {
  getUser,
  getUserDefault,
};
