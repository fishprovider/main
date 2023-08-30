import type {
  AccountRepository, BaseServiceGetResult, BaseServiceParams, GetUserFilter,
  UpdateUserPayload, User, UserRepository,
} from '..';

export type GetUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;

export type UpdateUserService = (params: BaseServiceParams & {
  filter: GetUserFilter,
  payload: UpdateUserPayload,
  repositories: {
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;

export type RefreshUserRolesService = (params: BaseServiceParams & {
  repositories: {
    account: AccountRepository
    user: UserRepository
  },
}) => Promise<BaseServiceGetResult<User>>;
