import { getNews } from '@fishprovider/adapter-backend';
import { MongoNewsRepository } from '@fishprovider/framework-mongo';

export default getNews(MongoNewsRepository);
