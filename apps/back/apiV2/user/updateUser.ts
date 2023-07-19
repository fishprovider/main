import { updateUser } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default updateUser(MongoUserRepository);
