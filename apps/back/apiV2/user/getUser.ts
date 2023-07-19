import { getUser } from '@fishprovider/adapter-backend';
import { MongoUserRepository } from '@fishprovider/framework-mongo';

export default getUser(MongoUserRepository);
