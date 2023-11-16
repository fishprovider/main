export interface UserRoles {
  admin?: boolean;
  adminWeb?: boolean;
  managerWeb?: boolean;

  adminAccounts?: Record<string, boolean>;
  protectorAccounts?: Record<string, boolean>;
  traderAccounts?: Record<string, boolean>;
  viewerAccounts?: Record<string, boolean>;
}

export interface UserPushNotif {
  type: 'fcm' | 'expo',
  token: string,
  topic?: string,
  data?: any,
}

export interface User {
  _id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRoles;
  starAccounts?: Record<string, boolean>;

  telegram?: {
    userId: string;
    userName?: string;
    phoneNumber?: string;
  };

  pushNotif?: UserPushNotif[];

  updatedAt: Date;
  createdAt: Date;
}
