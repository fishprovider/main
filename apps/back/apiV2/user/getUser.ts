import { UserController, UserSession } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const getUser = async ({ userSession } : {
  userSession: UserSession,
}) => UserController(MongoUserRepository, userSession).getUser();

export default getUser;
