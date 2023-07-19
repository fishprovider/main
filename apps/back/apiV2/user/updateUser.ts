import { UserController } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

import type { ApiHandlerParams } from '~types/api';

const updateUser = async (
  { userSession, data }: ApiHandlerParams,
) => UserController(MongoUserRepository, userSession).updateUser(data);

export default updateUser;
