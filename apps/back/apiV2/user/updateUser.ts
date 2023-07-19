import { UserController, UserSession } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const updateUser = async ({ userSession, payload } : {
  userSession: UserSession,
  payload: any,
}) => UserController(MongoUserRepository, userSession).updateUser(payload);

export default updateUser;
