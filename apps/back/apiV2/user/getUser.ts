import { UserController } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

import type { ApiHandlerParams } from '~types/api';

const getUser = async (
  { userSession }: ApiHandlerParams,
) => UserController(MongoUserRepository, userSession).getUser();

export default getUser;
