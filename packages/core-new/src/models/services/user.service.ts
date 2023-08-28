import type {
  BaseService, GetUserParams, RefreshUserRolesParams,
  UpdateUserParams, User, UserRepository, UserRoles,
} from '..';

export type GetUserService = (
  params: GetUserParams
) => Promise<Partial<User>>;

export type UpdateUserService = (
  params: UpdateUserParams,
  roles?: UserRoles
) => Promise<Partial<User>>;

export type RefreshUserRolesService = (
  params: RefreshUserRolesParams
) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  _repo: UserRepository
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
