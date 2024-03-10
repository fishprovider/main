interface Roles {
  admin?: boolean;
  adminWeb?: boolean;
  managerWeb?: boolean;
  adminAccounts?: Record<string, boolean>;
  protectorAccounts?: Record<string, boolean>;
  traderAccounts?: Record<string, boolean>;
  viewerAccounts?: Record<string, boolean>;
}

interface User {
  _id: string;
  uid: string;
  email: string;
  name: string;

  picture?: string;

  updatedAt?: Date;
  createdAt?: Date;

  roles?: Roles
  starAccounts?: Record<string, boolean>;

  telegram?: {
    userId: string;
    userName?: string;
    phoneNumber?: string;
  };

  pushNotif?: {
    type: 'fcm' | 'expo',
    token: string,
    topic?: string,
    data?: any,
  }[];
}

export type {
  Roles,
  User,
};
