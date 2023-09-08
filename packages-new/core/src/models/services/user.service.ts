import type {
  AccountRepository, BaseGetOptions, BaseServiceGetManyResult,
  BaseServiceGetResult,
  BaseServiceParams, BaseUpdateOptions, GetUserFilter,
  UpdateUserPayload, User, UserRepository,
} from '..';

export type GetUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;

export type GetUsersService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  options: BaseGetOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseServiceGetManyResult<User>>;

export type UpdateUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  options: BaseUpdateOptions<User>,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;

export type RefreshUserRolesService = (params: BaseServiceParams & {
  options: BaseUpdateOptions<User>,
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;
