export interface UserRolesEntity {
  admin?: boolean;
  adminWeb?: boolean;
  managerWeb?: boolean;
  adminProviders?: Record<string, boolean>;
  protectorProviders?: Record<string, boolean>;
  traderProviders?: Record<string, boolean>;
  viewerProviders?: Record<string, boolean>;
}

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  picture?: string;

  roles?: UserRolesEntity;
  starProviders?: Record<string, boolean>;

  fcmInfo?: Record<string, any>;
  telegram?: {
    userId: string;
    userName?: string;
    phoneNumber?: string;
  };

  updatedAt?: Date;
  createdAt?: Date;
}
