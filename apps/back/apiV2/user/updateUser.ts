import { UserController } from '@fishprovider/adapter-backend';
import type { UpdateUserUseCasePayload } from '@fishprovider/application-rules';
import type { UserSession } from '@fishprovider/enterprise-rules';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

const updateUser = async ({ userSession, payload } : {
  userSession: UserSession,
  payload: UpdateUserUseCasePayload,
}) => UserController(MongoUserRepository, userSession).updateUser(payload);

export default updateUser;
