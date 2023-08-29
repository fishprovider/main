import type {
  AccountRepository, BaseService, BaseServiceParams, GetUserParams,
  UpdateUserParams, User, UserRepository,
} from '..';

export interface UserServiceBaseParams extends BaseServiceParams {
  repositories: {
    user: UserRepository
  },
}

//
// function params
//

export type GetUserService = (params: UserServiceBaseParams & {
  params: GetUserParams,
}) => Promise<Partial<User>>;

export type UpdateUserService = (params: UserServiceBaseParams & {
  params: UpdateUserParams,
  repositories: {
    user: UserRepository
  },
}) => Promise<Partial<User>>;

export type RefreshUserRolesService = (params: UserServiceBaseParams & {
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<Partial<User>>;

export interface IUserService extends BaseService {
  getUser: GetUserService;
  updateUser: UpdateUserService;
  refreshUserRoles: RefreshUserRolesService;
}
