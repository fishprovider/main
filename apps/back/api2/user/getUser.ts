import { UserController } from '@fishprovider/adapter-backend';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const getUser = async (
  userSession: UserSession,
) => {
  const user = await UserController(MongoUserRepository, userSession).getUser();
  return user;
};

export default getUser;
