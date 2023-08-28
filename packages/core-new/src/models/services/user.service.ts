import type {
  BaseService, GetUserParams, UpdateUserParams, User, UserRepository, UserSession,
} from '..';

export type GetUserService = (
  params: GetUserParams,
  userSession: UserSession,
) => Promise<Partial<User>>;

export type UpdateUserService = (
  params: UpdateUserParams,
  userSession: UserSession,
) => Promise<Partial<User>>;

export type RefreshUserRolesService = (
  userSession: UserSession,
) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  repo: UserRepository
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
