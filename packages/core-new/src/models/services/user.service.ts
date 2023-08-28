import type {
  BaseService, GetUserParams, UpdateUserParams, User, UserRepository,
} from '..';

export type GetUserService = (
  params: GetUserParams
) => Promise<Partial<User> | null>;

export type UpdateUserService = (
  params: UpdateUserParams
) => Promise<Partial<User>>;

export type RefreshUserRolesService = (
  params: UpdateUserParams
) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  repo: UserRepository
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
