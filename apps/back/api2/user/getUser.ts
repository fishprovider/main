import { UserController } from '@fishprovider/adapter-backend';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const getUser = async (
  userSession: UserSession,
) => UserController(MongoUserRepository, userSession).getUser();

export default getUser;
