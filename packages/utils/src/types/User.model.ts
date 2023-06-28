interface Roles {
  admin?: boolean;
  adminWeb?: boolean;
  managerWeb?: boolean;
  adminProviders?: Record<string, boolean>;
  protectorProviders?: Record<string, boolean>;
  traderProviders?: Record<string, boolean>;
  viewerProviders?: Record<string, boolean>;
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
  starProviders?: Record<string, boolean>;
  fcmInfo?: Record<string, any>;

  telegram?: {
    userId: string;
    userName?: string;
    phoneNumber?: string;
  };
}

export type {
  Roles,
  User,
};
