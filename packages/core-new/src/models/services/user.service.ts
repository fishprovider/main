import type {
  AccountRepository, BaseServiceParams, GetUserParams,
  UpdateUserParams, User, UserRepository,
} from '..';

export interface UserServiceBaseParams extends BaseServiceParams {
  repositories: {
    user: UserRepository
  },
}

//
// services
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
