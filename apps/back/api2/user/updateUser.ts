import { UserController } from '@fishprovider/adapter-backend';
import type { UpdateUserUseCaseParams } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const updateUser = async (
  userSession: UserSession,
  params: UpdateUserUseCaseParams,
) => {
  const res = await UserController(MongoUserRepository, userSession).updateUser(params);
  return res;
};

export default updateUser;
