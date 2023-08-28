import type {
  AccountRepository, BaseService, GetUserParams, UpdateUserParams,
  User, UserRepository, UserSession,
} from '..';

export type GetUserService = (
  repositories: {
    user: UserRepository
  },
  params: GetUserParams,
  userSession: UserSession,
) => Promise<Partial<User>>;

export type UpdateUserService = (
  repositories: {
    user: UserRepository
  },
  params: UpdateUserParams,
  userSession: UserSession,
) => Promise<Partial<User>>;

export type RefreshUserRolesService = (
  repositories: {
    user: UserRepository
    account: AccountRepository
  },
  userSession: UserSession,
) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
