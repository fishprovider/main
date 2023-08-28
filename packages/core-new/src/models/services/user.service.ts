import type {
  BaseService, GetUserParams, RefreshUserRolesParams,
  UpdateUserParams, User, UserRepository, UserSession,
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
  params: RefreshUserRolesParams,
  userSession: UserSession,
) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  _repo: UserRepository
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
